<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ headerName }}</p>
      <button class="delete" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <AgGridVue
        class="ag-grid ag-theme-balham full-height"
        v-model="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="colDef"
        suppressColumnVirtualisation
        @gridReady="gridReady"
        domLayout="autoHeight"
      ></AgGridVue>
    </section>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { ColDef } from "@ag-grid-community/core";
import { GridApi, ColumnApi } from "@ag-grid-community/core";
import { AgGridVue } from "@ag-grid-community/vue";
import { defaultColDef } from "./TableLogic";

@Component({
  components: {
    AgGridVue
  }
})
export default class AgGridLink extends Vue {
  /**
   * Header of the column clicked on
   */
  @Prop({ default: "" })
  private headerName!: string;
  /**
   * A list of features to include in the modal
   */
  @Prop({ default: () => [] })
  private features!: google.maps.Data.Feature[];
  private columnDefs: ColDef[] = [];
  private rowData: { [index: string]: any }[] = [];
  private colDef = defaultColDef;

  private created() {
    const rowDataArray: { [index: string]: any }[] = [];
    this.features.forEach(feature => {
      let index: number = 0;
      const colDef: ColDef[] = [];
      const rowData: { [index: string]: any } = {};
      feature.forEachProperty((value, name) => {
        colDef.push({
          headerName: name,
          field: index.toString()
        });
        rowData[index.toString()] = value;
        index = index + 1;
      });
      rowDataArray.push(rowData);
      this.columnDefs = colDef;
    });
    this.rowData = rowDataArray;
  }

  private gridReady(config: { api: GridApi; columnApi: ColumnApi }) {
    config.columnApi.autoSizeAllColumns();
  }
}
</script>
<style lang="scss" scoped>
@import "~@ag-grid-community/core/dist/styles/ag-grid.css";
@import "~@ag-grid-community/core/dist/styles/ag-theme-balham.css";
.modal-card {
  width: 100%;
  .modal-card-body {
    width: 50vw;
  }
}
</style>