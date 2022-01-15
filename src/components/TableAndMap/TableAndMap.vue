<template>
  <div class="full-height">
    <div
      v-show="hasMap"
      :id="mapId"
      :class="sectionClass"
    >
      <GoogleMap
        v-if="showMap"
        :uploaded-file="uploadedFile"
        :hidden-marker-indices="hiddenMarkerIndices"
        :overlay-events="overlayEvents"
        :create-info-window="createInfoWindow"
        :display-heatmap="displayHeatmap"
        :display-markers="displayMarkers"
        :display-clusters="displayClusters"
        :clicked-marker="clickedMarker"
        :group-by-key="groupByKey"
        :layers="layers"
        @marker-selected="markerSelected"
        @update-overlay-events="updateOverlayEvents"
      />
    </div>
    <div
      v-show="hasTable"
      :id="tableId"
      :class="sectionClass"
    >
      <Table
        ref="Table"
        :row-data="rowData"
        :filters="filters"
        :sorting="sorting"
        :table-logic="tableLogic"
        :overlay-events="overlayEvents"
        :view-options="viewOptions"
        :clicked-marker="clickedMarker"
        @sort-changed="sortChanged"
        @filter-changed="filterChanged"
        @hidden-marker-indices-changed="hiddenMarkerIndicesChanged"
        @marker-selected="markerSelected"
      />
    </div>
    <PreviewCard
      v-if="clickedMarker"
      :clicked-marker="clickedMarker"
      :uploaded-file="uploadedFile"
      :layers="layers"
      @close="close"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import Table from "./Table/Table.vue";
import PreviewCard from "./PreviewCard/PreviewCard.vue";
import GoogleMap from "./GoogleMap/GoogleMap.vue";
import Split from "split.js";
import Utils from "./GoogleMap/Logic/Utils";
import TableLogic from "./Table/Logic/TableLogic";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";

interface Split {
  destroy: () => void;
}
/**
 * Display the uploaded file in a table and on a map.
 */
@Component({
  name: "TableAndMap",
  components: {
    GoogleMap,
    Table,
    PreviewCard,
  },
})
export default class TableAndMap extends Vue {
  /**
   * All of the google markers to display in the table and map
   */
  @Prop()
  private uploadedFile!: UploadedFile;
  /**
   * An object used to apply previous filters
   */
  @Prop({ default: Object() })
  private filters!: { [colId: string]: any };
  /**
   * An array of objects to apply previous sorting
   */
  @Prop({ default: Array() })
  private sorting!: { colId: string; sort: string }[];
  /**
   * All of the overlay jsons
   */
  @Prop({ default: Array() })
  private overlayEventJsons!: OverlayJson[];
  /**
   * Config for the table, must specify the columns
   */
  @Prop()
  private tableLogic!: TableLogic;
  /**
   * All of the view options for what to display on the screen
   */
  @Prop()
  private viewOptions!: string[];
  /**
   * All of the uploaded geojson and shapefile layers
   */
  @Prop()
  private layers!: { id: string, fileName: string, data: object | null }[];

  private mapId = "Map-" + Math.random().toString(36).substring(7);
  private tableId = "Table-" + Math.random().toString(36).substring(7);
  private rowData: Row[] = [];
  private hiddenMarkerIndices: Set<number> = new Set();
  private clickedMarker: Row | null = null;
  private splitInstance: Split | null = null;
  private showMap: boolean = false;

  private get hasMap(): boolean {
    return this.viewOptions.indexOf("map") > -1;
  }

  private get hasTable(): boolean {
    return this.viewOptions.indexOf("table") > -1;
  }

  private get displayHeatmap(): boolean {
    return this.viewOptions.indexOf("map:heat") > -1;
  }

  private get displayMarkers(): boolean {
    return this.viewOptions.indexOf("map:markers") > -1;
  }

  private get displayClusters(): boolean {
    return this.viewOptions.indexOf("map:clusters") > -1;
  }

  private get groupByKey(): string | null {
    const groupByIndex = this.viewOptions.findIndex((_) =>
      _.startsWith("map:groupByKey:")
    );
    if (groupByIndex > -1) {
      return this.viewOptions[groupByIndex].split("map:groupByKey:")[1];
    }
    return null;
  }

  private get sectionClass(): string {
    if (this.hasMap && this.hasTable) {
      return "half-height";
    }
    return "full-height";
  }

  private get overlayEvents(): google.maps.drawing.OverlayCompleteEvent[] {
    return Utils.jsonToOverlayEvents(this.overlayEventJsons);
  }

  @Watch("uploadedFile")
  private uploadedFileUpdated(): void {
    this.rowData = this.uploadedFile.data.slice(
      this.uploadedFile.firstRowHeader ? 1 : 0
    );
    this.hiddenMarkerIndices = new Set();
    this.clickedMarker = null;
  }

  @Watch("viewOptions")
  private viewOptionsUpdated(): void {
    if (
      document.getElementById(this.mapId) &&
      document.getElementById(this.tableId)
    ) {
      if ((!this.hasMap || !this.hasTable) && this.splitInstance) {
        this.splitInstance.destroy();
        this.splitInstance = null;
      }
      if (this.hasMap && this.hasTable && !this.splitInstance) {
        this.splitInstance = Split([`#${this.mapId}`, `#${this.tableId}`], {
          direction: "vertical",
          sizes: [50, 50],
        });
      }
    }
  }

  private created(): void {
    this.uploadedFileUpdated();
  }

  private mounted(): void {
    this.viewOptionsUpdated();
  }

  private createInfoWindow(
    marker: google.maps.Marker,
    row: Row
  ): google.maps.InfoWindow | null {
    if (this.viewOptions.indexOf("map:disableMarkers") > -1) {
      return null;
    }
    if (this.uploadedFile.firstRowHeader) {
      const keys = ["Name", "Address"];
      let content = "";
      this.uploadedFile.data[0].data.forEach(
        (header: string | number | null, index: number) => {
          keys.forEach((key) => {
            if (
              header &&
              header.toString().toLowerCase().indexOf(key.toLowerCase()) > -1
            ) {
              if (row[index]) {
                content =
                  content + `<div><b>${header}:</b> ${row[index]}</div>`;
              }
            }
          });
        }
      );
      if (content.length) {
        return new google.maps.InfoWindow({
          content,
        });
      }
    }
    return null;
  }

  private markerSelected(id: string): void {
    if (this.viewOptions.indexOf("map:disableMarkers") > -1) {
      return;
    }
    const clickedMarker = this.rowData.find((_) => _.id === id);
    if (clickedMarker) {
      this.clickedMarker = clickedMarker;
    }
  }

  private updateOverlayEvents(
    overlayEvents: google.maps.drawing.OverlayCompleteEvent[]
  ): void {
    const overlayEventJsons = Utils.overlayEventsToJson(overlayEvents);
    /**
     * Notify parent of newly drawn polygons on the map
     *
     * @type {OverlayJson[]}
     */
    this.$emit("update-overlay-event-jsons", overlayEventJsons);
    this.$nextTick(() => {
      (this.$refs.Table as Table).onFilterChanged();
    });
  }

  private sortChanged(sorting: { colId: string; sort: string }[]) {
    /**
     * Update the sorting config
     *
     * @type {{ colId: string, sort: string }[]}
     */
    this.$emit("sort-changed", sorting);
  }

  private filterChanged(filters: { [colId: string]: any }) {
    /**
     * Update the filter config
     *
     * @type {{ [colId: string]: any }}
     */
    this.$emit("filter-changed", filters);
  }

  private hiddenMarkerIndicesChanged(hiddenMarkerIndices: Set<number>) {
    /* We want to show the map after the hidden marker indices have first been decided. */
    this.showMap = true;
    this.hiddenMarkerIndices = hiddenMarkerIndices;
  }

  private close(): void {
    this.clickedMarker = null;
  }
}
</script>
<style lang='scss'>
@import "@/sass/gutter.scss";
</style>