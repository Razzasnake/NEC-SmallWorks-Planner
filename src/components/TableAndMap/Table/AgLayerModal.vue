<template>
  <v-dialog v-model="visible" @click:outside="$emit('close')" max-width="1600">
    <v-card>
      <v-card-title class="headline">{{ headerName }}</v-card-title>
      <v-card-text>
        <AgGridVue
          class="ag-theme-balham"
          v-model="rowData"
          :columnDefs="columnDefs"
          :defaultColDef="colDef"
          suppressColumnVirtualisation
          @gridReady="gridReady"
          domLayout="autoHeight"
        ></AgGridVue>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close')" color="primary">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  private visible: boolean = true;
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