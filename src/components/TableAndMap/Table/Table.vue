<template>
  <AgGridVue
    class="ag-grid ag-theme-balham full-height"
    v-model="rowDataAux"
    :columnDefs="tableLogic.columnDefs"
    :defaultColDef="tableLogic.defaultColDef"
    :isExternalFilterPresent="isExternalFilterPresent"
    :doesExternalFilterPass="doesExternalFilterPass"
    :getRowNodeId="getRowNodeId"
    :fillOperation="fillOperation"
    suppressColumnVirtualisation
    suppressMenuHide
    @gridReady="gridReady"
    @data-model-changed="dataModelUpdated"
    @sortChanged="sortChanged"
    @filterChanged="filterChanged"
    @cellKeyPress="onCellKeyPress"
  ></AgGridVue>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import { AgGridVue } from "ag-grid-vue";
import {
  GridApi,
  ColumnApi,
  RowNode,
  CellKeyPressEvent
} from "ag-grid-community";
import TableLogic from "./TableLogic";
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

  private rowDataAux: Row[] = [];
  private gridApi!: GridApi;

  @Watch("rowData")
  private rowDataChanged(): void {
    this.rowDataAux = cloneDeep(this.rowData);
  }

  private created() {
    this.rowDataChanged();
  }

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

  private dataModelUpdated(rowDataAux: Row[]) {
    const selectedMarkerIndices: Set<number> = new Set();
    const selectedMarkerIds: string[] = [];
    rowDataAux.forEach((row, index) => {
      if (row.isSelected) {
        selectedMarkerIndices.add(index);
        selectedMarkerIds.push(row.id);
      }
    });
    /**
     * Update the selected rows
     *
     * @type {{selectedMarkerIds: string[], selectedMarkerIndices: Set<number>}}
     */
    this.$emit("rowSelectionsChanged", {
      selectedMarkerIds,
      selectedMarkerIndices
    });
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
    this.rowDataAux.forEach((marker, index) => {
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

  private fillOperation(options: any) {
    if (options.column && options.column.colId === "isSelected") {
      const toUse = options.initialValues[0];
      /* We have to use nextTick here. Cell ranges isn't updated until after next tick. */
      this.$nextTick(() => {
        const cellRanges = this.gridApi.getCellRanges();
        cellRanges.forEach(range => {
          if (range.startRow !== undefined && range.endRow !== undefined) {
            for (
              let i = range.startRow.rowIndex;
              i < range.endRow.rowIndex + 1;
              i++
            ) {
              this.gridApi
                .getDisplayedRowAtIndex(i)
                .setDataValue("isSelected", toUse);
            }
          }
        });
      });
    }
  }

  private onCellKeyPress(e: CellKeyPressEvent): void {
    if (e.event && (e.event as KeyboardEvent).keyCode === 32) {
      e.node.setDataValue("isSelected", e.node.isSelected());
    }
  }

  public select(ids: string[]): void {
    ids.forEach(id => {
      this.gridApi.getRowNode(id).setDataValue("isSelected", true);
    });
  }

  public deselect(ids: string[]): void {
    ids.forEach(id => {
      this.gridApi.getRowNode(id).setDataValue("isSelected", false);
    });
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