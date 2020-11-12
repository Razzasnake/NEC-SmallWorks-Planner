<template>
  <AgGridVue
    v-model="rowData"
    class="ag-theme-balham full-height"
    :column-defs="tableLogic.columnDefs"
    :default-col-def="colDef"
    :is-external-filter-present="isExternalFilterPresent"
    :does-external-filter-pass="doesExternalFilterPass"
    :get-row-node-id="getRowNodeId"
    :modules="modules"
    suppress-menu-hide
    enable-cell-text-selection
    @grid-ready="gridReady"
    @sort-changed="sortChanged"
    @filter-changed="filterChanged"
  />
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { AgGridVue } from "@ag-grid-community/vue";
import {
  GridApi,
  ColumnApi,
  RowNode,
  CellKeyPressEvent,
} from "@ag-grid-community/core";
import TableLogic, { defaultColDef } from "./Logic/TableLogic";
import { Row } from "@/entities/UploadedFile";
import CalculateFooterWorker from "worker-loader!./Logic/WebWorkers/CalculateFooter.worker";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";

type PinnedData = {
  min: number[];
  max: number[];
  avg: number[];
  total: number[];
};

/**
 * Display the uploaded file in a table and on a map.
 */
@Component({
  name: "TableAndMapTable",
  components: {
    AgGridVue,
  },
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
  @Prop({ default: Object() })
  private filters!: { [colId: string]: any };
  /**
   * An array of objects to apply previous sorting
   */
  @Prop({ default: Array() })
  private sorting!: { colId: string; sort: string }[];
  /**
   * Config for the table, must specify the columns
   */
  @Prop()
  private tableLogic!: TableLogic;
  /**
   * All of the polygons that have been drawn on the map
   */
  @Prop({ default: Array() })
  private overlayEvents!: google.maps.drawing.OverlayCompleteEvent[];
  /**
   * Whether or not to show the footer rows
   */
  @Prop({
    default: [
      "table",
      "table:footer",
      "table:footer:avg"
    ],
  })
  private viewOptions!: string[];
  /**
   * Row being shown in the preview card, scroll to it and highlight it
   */
  @Prop({ default: null })
  private clickedMarker!: Row | null;

  private colDef = defaultColDef;
  private gridApi!: GridApi;
  private columnApi!: ColumnApi;
  private modules = [ClientSideRowModelModule, CsvExportModule];

  @Watch("viewOptions")
  private viewOptionsUpdated() {
    if (this.gridApi) {
      this.updatePinnedFooter();
    }
  }

  @Watch("clickedMarker")
  private clickedMarkerUpdated(newValue: Row | null, oldValue: Row | null) {
    if (oldValue) {
      this.gridApi.getRowNode(oldValue.id).setSelected(false);
    }
    if (this.clickedMarker) {
      const node = this.gridApi.getRowNode(this.clickedMarker.id);
      node.setSelected(true);
      this.gridApi.ensureIndexVisible(node.rowIndex);
    }
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
    this.columnApi = config.columnApi;
    if (Object.keys(this.filters).length) {
      this.gridApi.setFilterModel(this.filters);
    }
    if (this.sorting.length) {
      this.gridApi.setSortModel(this.sorting);
    }
    this.updateVisibleRows();
    this.tableLogic.setGridApi(this.gridApi);
  }

  private updatePinnedFooter() {
    if (!this.viewOptions.length) {
      this.gridApi.setPinnedBottomRowData([]);
      return;
    }
    const rowData: Row[] = [];
    this.gridApi.forEachNodeAfterFilter((node, index) => {
      rowData.push(node.data.webWorkerSafeState);
    });
    const columnIds = this.columnApi
      .getAllColumns()
      .filter((column) => column.getColDef().filter === "number")
      .map((col) => col.getColId());

    const worker = new CalculateFooterWorker();
    worker.postMessage({ columnIds, rowData });
    worker.onmessage = (event) => {
      const pinnedData: PinnedData = event.data;
      const pinnedFooter = [];
      if (this.viewOptions.includes("table:footer:min")) {
        pinnedFooter.push({ ...pinnedData.min, preview: "Min" });
      }
      if (this.viewOptions.includes("table:footer:max")) {
        pinnedFooter.push({ ...pinnedData.max, preview: "Max" });
      }
      if (this.viewOptions.includes("table:footer:avg")) {
        pinnedFooter.push({ ...pinnedData.avg, preview: "Avg" });
      }
      if (this.viewOptions.includes("table:footer:total")) {
        pinnedFooter.push({ ...pinnedData.total, preview: "Total" });
      }
      this.gridApi.setPinnedBottomRowData(pinnedFooter);
      worker.terminate();
    };
  }

  private sortChanged() {
    /**
     * Update the sorting config
     *
     * @type {{ colId: string, sort: string }[]}
     */
    this.$emit("sort-changed", this.gridApi.getSortModel());
  }

  private filterChanged() {
    /**
     * Update the filter config
     *
     * @type {{ [colId: string]: any }}
     */
    this.$emit("filter-changed", this.gridApi.getFilterModel());
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
    this.updatePinnedFooter();
    /**
     * Notify the parent what rows are no longer visible
     *
     * @type {Set<number>}
     */
    this.$emit("hidden-marker-indices-changed", hiddenMarkerIndices);
  }

  private getRowNodeId(data: Row): string {
    return data.id;
  }

  public onFilterChanged() {
    this.gridApi.onFilterChanged();
  }

  public exportCsv() {
    this.gridApi.exportDataAsCsv({
      skipPinnedBottom: true,
    });
  }
}
</script>
<style lang='scss' scoped>
@import "~@ag-grid-community/core/dist/styles/ag-grid.css";
@import "~@ag-grid-community/core/dist/styles/ag-theme-balham.css";
</style>