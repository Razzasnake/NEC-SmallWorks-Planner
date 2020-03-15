<template>
  <AgGridVue
    class="ag-theme-balham"
    v-model="rowData"
    :columnDefs="tableConfig.columnDefs"
    :defaultColDef="tableConfig.defaultColDef"
    @gridReady="gridReady"
    @sortChanged="sortChanged"
    @filterChanged="filterChanged"
  ></AgGridVue>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { GridApi, ColumnApi } from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue";
import TableConfig from "./TableConfig";
import UploadedFile from "@/entities/UploadedFile";

/**
 * Display the uploaded data in a table
 */
@Component({
  components: {
    AgGridVue
  }
})
export default class Table extends Vue {
  /**
   * Uploaded file to be displayed on the table
   */
  @Prop({ default: () => [] })
  private uploadedFile!: UploadedFile;
  /**
   * An object used to apply previous filters
   */
  @Prop({ default: () => {} })
  private filters!: { [colId: string]: any };
  /**
   * an array of objects to apply previous sorting
   */
  @Prop({ default: () => [] })
  private sorting!: { colId: string; sort: string }[];
  private rowData: any[] = this.uploadedFile.data
    .slice(this.uploadedFile.firstRowHeader ? 1 : 0)
    .map(row => {
      const data: { [key: string]: any } = {};
      row.forEach((col, colIndex) => {
        data[colIndex.toString()] = col;
      });
      return data;
    });
  private tableConfig = new TableConfig(this.uploadedFile);

  private gridReady(config: {
    type: string;
    api: GridApi;
    columnApi: ColumnApi;
  }) {
    config.api.setFilterModel(this.filters);
    config.api.setSortModel(this.sorting);
  }

  private sortChanged(config: {
    type: string;
    api: GridApi;
    columnApi: ColumnApi;
  }) {
    /**
     * Update the sorting config
     *
     * @type {{ colId: string, sort: string }[]}
     */
    this.$emit("sortChanged", config.api.getSortModel());
  }

  private filterChanged(config: {
    type: string;
    api: GridApi;
    columnApi: ColumnApi;
  }) {
    /**
     * Update the filter config
     *
     * @type {{ [colId: string]: any }}
     */
    this.$emit("filterChanged", config.api.getFilterModel());
  }
}
</script>
<style lang='scss' scoped>
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-balham.css";
</style>