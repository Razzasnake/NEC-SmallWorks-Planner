<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ headerName }}</p>
    </header>
    <section class="modal-card-body">
      <AgGridVue
        class="ag-grid ag-theme-balham full-height"
        v-model="rowData"
        :columnDefs="colDef"
        domLayout='autoHeight'
      ></AgGridVue>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
    </footer>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { ColDef } from "@ag-grid-community/core";
import { AgGridVue } from "@ag-grid-community/vue";

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
  private colDef: ColDef[] = []
  private rowData: { [index: string]: any }[] = [];

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
      this.colDef = colDef;
    });
    this.rowData = rowDataArray;
  }
}
</script>
<style lang="scss" scoped>
@import "~@ag-grid-community/core/dist/styles/ag-grid.css";
@import "~@ag-grid-community/core/dist/styles/ag-theme-balham.css";
</style>