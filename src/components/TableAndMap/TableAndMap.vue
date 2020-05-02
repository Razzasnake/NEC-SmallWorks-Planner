<template>
  <div class="table-and-map full-height">
    <div :id="mapId" class="full-height">
      <GoogleMap
        v-if="map"
        :uploadedFile="uploadedFile"
        :hiddenMarkerIndices="hiddenMarkerIndices"
        :selectedMarkerIndices="selectedMarkerIndices"
        :overlayEvents="overlayEvents"
        :createInfoWindow="createInfoWindow"
        :allowDraw="map.allowDraw"
        @markerSelected="markerSelected"
        @updateOverlayEvents="updateOverlayEvents"
      ></GoogleMap>
    </div>
    <div :id="tableId" class="full-height">
      <Table
        ref="Table"
        :rowData="rowData"
        :filters="filters"
        :sorting="sorting"
        :tableLogic="tableLogic"
        :overlayEvents="overlayEvents"
        @rowSelectionsChanged="rowSelectionsChanged"
        @sortChanged="sortChanged"
        @filterChanged="filterChanged"
        @hiddenMarkerIndicesChanged="hiddenMarkerIndicesChanged"
      ></Table>
    </div>
    <PreviewCard
      class="entity-preview"
      v-if="clickedMarker"
      :clickedMarker="clickedMarker"
      :uploadedFile="uploadedFile"
      @select="$refs.Table.select"
      @deselect="$refs.Table.deselect"
      @close="close"
    ></PreviewCard>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import Table from "./Table/Table.vue";
import PreviewCard from "./PreviewCard/PreviewCard.vue";
import GoogleMap from "./GoogleMap/GoogleMap.vue";
import Split from "split.js";
import { cloneDeep } from "lodash";
import { TableAndMapMap } from "./Types";
import Utils from "./GoogleMap/Utils";
import TableLogic from "./Table/TableLogic";
import UploadedFile, { Row } from "@/entities/UploadedFile";

/**
 * Display the uploaded file in a table and on a map.
 */
@Component({
  components: {
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
  private selectedMarkerIndices: Set<number> = new Set();
  private clickedMarker: Row | null = null;

  private get overlayEvents(): google.maps.drawing.OverlayCompleteEvent[] {
    if (this.map) {
      return Utils.jsonToOverlayEvents(this.map.overlayEventJsons);
    }
    return [];
  }

  @Watch("uploadedFile")
  private uploadedFileUpdated(): void {
    this.rowData = cloneDeep(
      this.uploadedFile.data.slice(this.uploadedFile.firstRowHeader ? 1 : 0)
    );
    this.hiddenMarkerIndices = new Set();
    this.selectedMarkerIndices = new Set(
      this.uploadedFile.data
        .map((row, index) => {
          if (row.isSelected) {
            return index;
          }
          return -1;
        })
        .filter(_ => _ > -1)
    );
    this.clickedMarker = null;
  }

  private created(): void {
    this.uploadedFileUpdated();
  }

  private mounted(): void {
    if (
      document.getElementById(this.mapId) &&
      document.getElementById(this.tableId)
    ) {
      Split([`#${this.mapId}`, `#${this.tableId}`], {
        direction: "vertical",
        sizes: [50, 50]
      });
    }
  }

  private createInfoWindow(
    marker: google.maps.Marker,
    row: Row
  ): google.maps.InfoWindow | null {
    return new google.maps.InfoWindow({
      content: `TODO: Info Window - ${row.index}`
    });
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

  private rowSelectionsChanged(payload: {
    selectedMarkerIds: string[];
    selectedMarkerIndices: Set<number>;
  }) {
    this.selectedMarkerIndices.forEach(index => {
      if (!payload.selectedMarkerIndices.has(index)) {
        this.rowData[index].isSelected = false;
      }
    });
    payload.selectedMarkerIndices.forEach(index => {
      if (!this.selectedMarkerIndices.has(index)) {
        this.rowData[index].isSelected = true;
      }
    });
    this.selectedMarkerIndices = payload.selectedMarkerIndices;
    /**
     * Update the selected rows
     *
     * @type {string[]}
     */
    this.$emit("rowSelectionsChanged", payload.selectedMarkerIds);
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

  private hiddenMarkerIndicesChanged(hiddenMarkerIndices: Set<number>) {
    this.hiddenMarkerIndices = hiddenMarkerIndices;
  }

  private close(): void {
    this.clickedMarker = null;
  }
}
</script>
<style lang='scss' scoped>
.full-height {
  height: 100%;
}
.table-and-map {
  position: relative;
  .entity-preview {
    height: 100%;
    overflow: auto;
    z-index: 160;
    position: absolute;
    top: -2px;
    right: 0px;
    width: 500px;
  }
}
</style>
<style lang='scss'>
.gutter {
  background-color: #eeeeee;
  background-repeat: no-repeat;
  background-position: 50%;
  &.gutter-vertical {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
  }
  &:hover {
    cursor: row-resize;
  }
}
</style>