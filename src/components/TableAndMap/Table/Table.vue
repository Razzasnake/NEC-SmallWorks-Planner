<template>
  <AgGridVue
    class="ag-grid ag-theme-balham full-height"
    v-model="rowData"
    :columnDefs="tableLogic.columnDefs"
    :defaultColDef="colDef"
    :isExternalFilterPresent="isExternalFilterPresent"
    :doesExternalFilterPass="doesExternalFilterPass"
    :getRowNodeId="getRowNodeId"
    suppressColumnVirtualisation
    suppressMenuHide
    @gridReady="gridReady"
    @sortChanged="sortChanged"
    @filterChanged="filterChanged"
  ></AgGridVue>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { AgGridVue } from "ag-grid-vue";
import {
  GridApi,
  ColumnApi,
  RowNode,
  CellKeyPressEvent
} from "ag-grid-community";
import TableLogic, { defaultColDef } from "./TableLogic";
import { Row } from "@/entities/UploadedFile";

/**
 * Display the uploaded file in a table and on a map.
 */
@Component({
  components: {
    AgGridVue
  }
})
export default class Table extends Vue {
  /**
   * All of the google markers to display in the table and map
   */
  @Prop()
  private rowData!: Row[];
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
   * Config for the table, must specify the columns
   */
  @Prop()
  private tableLogic!: TableLogic;
  /**
   * All of the polygons that have been drawn on the map
   */
  @Prop({ default: () => [] })
  private overlayEvents!: google.maps.drawing.OverlayCompleteEvent[];

  private colDef = defaultColDef;
  private gridApi!: GridApi;

  private isExternalFilterPresent(): boolean {
    return this.overlayEvents.length > 0;
  }

  private doesExternalFilterPass(node: RowNode) {
    const latLng = new google.maps.LatLng(node.data.lat, node.data.lng);
    for (let i = 0; i < this.overlayEvents.length; i++) {
      const event = this.overlayEvents[i];
      let isContained: boolean = false;
      if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
        const rectangle = event.overlay as google.maps.Rectangle;
        isContained = rectangle.getBounds().contains(latLng);
      } else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay as google.maps.Polygon;
        isContained = google.maps.geometry.poly.containsLocation(
          latLng,
          polygon
        );
      } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
        const circle = event.overlay as google.maps.Circle;
        isContained =
          circle.getBounds().contains(latLng) &&
          google.maps.geometry.spherical.computeDistanceBetween(
            circle.getCenter(),
            latLng
          ) <= circle.getRadius();
      }
      if (isContained) {
        return true;
      }
    }
    return false;
  }

  private gridReady(config: { api: GridApi; columnApi: ColumnApi }) {
    this.gridApi = config.api;
    if (Object.keys(this.filters).length) {
      this.gridApi.setFilterModel(this.filters);
    }
    if (this.sorting.length) {
      this.gridApi.setSortModel(this.sorting);
    }
    config.columnApi.autoSizeAllColumns();
    this.updateVisibleRows();
  }

  private sortChanged() {
    /**
     * Update the sorting config
     *
     * @type {{ colId: string, sort: string }[]}
     */
    this.$emit("sortChanged", this.gridApi.getSortModel());
  }

  private filterChanged() {
    /**
     * Update the filter config
     *
     * @type {{ [colId: string]: any }}
     */
    this.$emit("filterChanged", this.gridApi.getFilterModel());
    this.updateVisibleRows();
  }

  private updateVisibleRows() {
    const visibleRowIds: Set<string> = new Set();
    this.gridApi.forEachNodeAfterFilter((node, index) => {
      visibleRowIds.add(node.data.id);
    });
    const hiddenMarkerIndices: Set<number> = new Set();
    this.rowData.forEach((marker, index) => {
      if (!visibleRowIds.has(marker.id)) {
        hiddenMarkerIndices.add(index);
      }
    });
    /**
     * Notify the parent what rows are no longer visible
     *
     * @type {Set<number>}
     */
    this.$emit("hiddenMarkerIndicesChanged", hiddenMarkerIndices);
  }

  private getRowNodeId(data: Row): string {
    return data.id;
  }

  public onFilterChanged(): void {
    this.gridApi.onFilterChanged();
  }
}
</script>
<style lang='scss' scoped>
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-balham.css";
.full-height {
  height: 100%;
}
</style>