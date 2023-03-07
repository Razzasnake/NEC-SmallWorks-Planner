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
    :enable-cell-text-selection="isPaidTier"
    suppress-menu-hide
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
  /**
   * Allow user to select the text from the table
   */
  @Prop({ default: false })
  private isPaidTier!: boolean;

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
      const node = this.gridApi.getRowNode(oldValue.id);
      if (node) {
        node.setSelected(false);
      }
    }
    if (this.clickedMarker) {
      const node = this.gridApi.getRowNode(this.clickedMarker.id);
      if (node) {
        node.setSelected(true);
        this.gridApi.ensureIndexVisible(node.rowIndex);
      }
    }
  }

  @Watch("filters")
  private filtersUpdated() {
    if (this.gridApi) {
      this.gridApi.setFilterModel(this.filters);
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
        isContained = rectangle.getBounds()!.contains(latLng);
      } else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay as google.maps.Polygon;
        isContained = google.maps.geometry.poly.containsLocation(
          latLng,
          polygon
        );
      } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
        const circle = event.overlay as google.maps.Circle;
        isContained =
          circle.getBounds()!.contains(latLng) &&
          google.maps.geometry.spherical.computeDistanceBetween(
            circle.getCenter()!,
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
      this.columnApi.applyColumnState({ state: this.sorting });
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
      rowData.push(node.data.data);
    });
    const columns = this.columnApi.getAllColumns();
    if (columns === null) {
      return;
    }
    const columnIds = columns
      .filter((column) => column.getColDef().filter === "agNumberColumnFilter")
      .map((col) => parseInt(col.getColId(), 10));

    const worker = new CalculateFooterWorker();
    worker.postMessage({ columnIds, rowData });
    worker.onmessage = (event) => {
      const pinnedData: PinnedData = event.data;
      const pinnedFooter = [];
      if (this.viewOptions.includes("table:footer:min")) {
        pinnedFooter.push({ data: {...pinnedData.min }, preview: "Min" });
      }
      if (this.viewOptions.includes("table:footer:max")) {
        pinnedFooter.push({ data: {...pinnedData.max }, preview: "Max" });
      }
      if (this.viewOptions.includes("table:footer:avg")) {
        pinnedFooter.push({ data: {...pinnedData.avg }, preview: "Avg" });
      }
      if (this.viewOptions.includes("table:footer:total")) {
        pinnedFooter.push({ data: {...pinnedData.total }, preview: "Total" });
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
    const sort = this.columnApi.getColumnState()
      .filter(_ => _.sort !== null)
      .map(_ => ({ colId: _.colId, sort: _.sort }));
    this.$emit("sort-changed", sort);
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