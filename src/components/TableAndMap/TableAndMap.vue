<template>
  <div class="table-and-map full-height">
    <Toolbar
      :viewOptions="viewOptions"
      @updateViewOptions="updateViewOptions"
      @updateExportOptions="updateExportOptions"
    ></Toolbar>
    <div class="table-and-map__main">
      <div :id="mapId" :class="sectionClass" v-show="hasMap">
        <GoogleMap
          v-if="map"
          :uploadedFile="uploadedFile"
          :hiddenMarkerIndices="hiddenMarkerIndices"
          :overlayEvents="overlayEvents"
          :createInfoWindow="createInfoWindow"
          :allowDraw="map.allowDraw"
          :displayHeatmap="displayHeatmap"
          :displayMarkers="displayMarkers"
          :clickedMarker="clickedMarker"
          @markerSelected="markerSelected"
          @updateOverlayEvents="updateOverlayEvents"
        ></GoogleMap>
      </div>
      <div :id="tableId" :class="sectionClass" v-show="hasTable">
        <Table
          ref="Table"
          :rowData="rowData"
          :filters="filters"
          :sorting="sorting"
          :tableLogic="tableLogic"
          :overlayEvents="overlayEvents"
          :viewOptions="viewOptions"
          :clickedMarker="clickedMarker"
          @sortChanged="sortChanged"
          @filterChanged="filterChanged"
          @hiddenMarkerIndicesChanged="hiddenMarkerIndicesChanged"
          @markerSelected="markerSelected"
        ></Table>
      </div>
      <PreviewCard
        class="entity-preview"
        v-if="clickedMarker"
        :clickedMarker="clickedMarker"
        :uploadedFile="uploadedFile"
        @close="close"
      ></PreviewCard>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import Table from "./Table/Table.vue";
import PreviewCard from "./PreviewCard/PreviewCard.vue";
import GoogleMap from "./GoogleMap/GoogleMap.vue";
import Split from "split.js";
import { TableAndMapMap } from "./Types";
import Utils from "./GoogleMap/Utils";
import TableLogic from "./Table/TableLogic";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import Toolbar from "./Toolbar/Toolbar.vue";

interface Split {
  destroy: () => void;
}
/**
 * Display the uploaded file in a table and on a map.
 */
@Component({
  components: {
    Toolbar,
    GoogleMap,
    Table,
    PreviewCard
  }
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
  @Prop({ default: () => {} })
  private filters!: { [colId: string]: any };
  /**
   * An array of objects to apply previous sorting
   */
  @Prop({ default: () => [] })
  private sorting!: { colId: string; sort: string }[];
  /**
   * Config for the map
   */
  @Prop({ default: null })
  private map!: TableAndMapMap | null;
  /**
   * Config for the table, must specify the columns
   */
  @Prop()
  private tableLogic!: TableLogic;

  private mapId =
    "Map-" +
    Math.random()
      .toString(36)
      .substring(7);
  private tableId =
    "Table-" +
    Math.random()
      .toString(36)
      .substring(7);
  private rowData: Row[] = [];
  private hiddenMarkerIndices: Set<number> = new Set();
  private clickedMarker: Row | null = null;
  private splitInstance: Split | null = null;
  private viewOptions: string[] = [
    "table",
    "table:footer:total",
    "table:footer:avg",
    "map",
    "map:markers"
  ];

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

  private get sectionClass(): string {
    if (this.hasMap && this.hasTable) {
      return "half-height";
    }
    return "full-height";
  }

  private get overlayEvents(): google.maps.drawing.OverlayCompleteEvent[] {
    if (this.map) {
      return Utils.jsonToOverlayEvents(this.map.overlayEventJsons);
    }
    return [];
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
      if (this.splitInstance) {
        this.splitInstance.destroy();
        this.splitInstance = null;
      }
      if (this.hasMap && this.hasTable) {
        this.splitInstance = Split([`#${this.mapId}`, `#${this.tableId}`], {
          direction: "vertical",
          sizes: [50, 50]
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
    if (this.uploadedFile.firstRowHeader) {
      const keys = ["Name", "Address"];
      let content = "";
      this.uploadedFile.data[0].data.forEach(
        (header: string, index: number) => {
          keys.forEach(key => {
            if (
              header &&
              header.toLowerCase().indexOf(key.toLowerCase()) > -1
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
          content
        });
      }
    }
    return null;
  }

  private markerSelected(id: string): void {
    const clickedMarker = this.rowData.find(_ => _.id === id);
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
    this.$emit("updateOverlayEventJsons", overlayEventJsons);
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
    this.$emit("sortChanged", sorting);
  }

  private filterChanged(filters: { [colId: string]: any }) {
    /**
     * Update the filter config
     *
     * @type {{ [colId: string]: any }}
     */
    this.$emit("filterChanged", filters);
  }

  private updateViewOptions(viewOptions: string[]) {
    this.viewOptions = viewOptions;
  }

  private updateExportOptions(exportOptions: string[]) {
    if (exportOptions.indexOf("export:csv") > -1) {
      (this.$refs.Table as Table).exportCsv();
    }
  }

  private hiddenMarkerIndicesChanged(hiddenMarkerIndices: Set<number>) {
    this.hiddenMarkerIndices = hiddenMarkerIndices;
  }

  private close(): void {
    this.clickedMarker = null;
  }
}
</script>
<style lang='scss' scoped>
.half-height {
  height: 50%;
}
.table-and-map {
  position: relative;
  .entity-preview {
    height: 100%;
    overflow: auto;
    z-index: 160;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 500px;
  }
  .table-and-map__main {
    height: calc(100% - 33px);
  }
}
</style>
<style lang='scss'>
@import "@/sass/gutter.scss";
</style>