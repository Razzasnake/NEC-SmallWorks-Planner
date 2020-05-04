<template>
  <div class="card full-height">
    <header class="card-header">
      <b-button class="width-50" v-if="!clickedMarker.isSelected" @click="select">Select</b-button>
      <b-button class="width-50" v-else @click="deselect">Deselect</b-button>
      <b-button class="width-50" @click="close">Close</b-button>
    </header>
    <div id="street-view"></div>
    <AgGridVue
      class="ag-grid ag-theme-balham"
      v-model="tableData"
      :columnDefs="tableColumns"
      :defaultColDef="defaultColDef"
      domLayout="autoHeight"
      @gridReady="gridReady"
    ></AgGridVue>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import { AgGridVue } from "ag-grid-vue";
import { GridApi, ColDef } from "ag-grid-community";
import Utils from "@/components/TableAndMap/GoogleMap/Utils";

/**
 * Display a preview of the marker/row that has been clicked.
 */
@Component({
  components: {
    AgGridVue
  }
})
export default class PreviewCard extends Vue {
  /**
   * The row that was clicked
   */
  @Prop()
  private clickedMarker!: Row;
  /**
   * The entire file that was uploaded
   */
  @Prop({ default: null })
  private uploadedFile!: UploadedFile;
  private panorama: google.maps.StreetViewPanorama | null = null;

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    enableCellChangeFlash: true,
    menuTabs: ["filterMenuTab", "columnsMenuTab", "generalMenuTab"]
  };

  private mounted() {
    Utils.injectGoogleMapsLibrary([]).then(google => {
      this.updatePanorama();
    });
  }

  @Watch("clickedMarker")
  private updatePanorama(): void {
    this.panorama = null;
    const el = document.getElementById("street-view");
    if (el && this.clickedMarker.lat && this.clickedMarker.lng) {
      this.panorama = new google.maps.StreetViewPanorama(el, {
        position: {
          lat: this.clickedMarker.lat,
          lng: this.clickedMarker.lng
        },
        panControl: false,
        zoomControl: false,
        fullscreenControl: false,
        addressControl: false
      });
    }
  }

  private get tableData() {
    let values: { label: any; value: any }[] = [];
    if (this.uploadedFile.firstRowHeader) {
      this.uploadedFile.data[0].data.forEach((key, index) => {
        values.push({ label: key, value: this.clickedMarker.data[index] });
      });
    } else {
      this.uploadedFile.data[0].data.forEach((_, index) => {
        const key = `Column ${index.toString()}`;
        values.push({ label: key, value: this.clickedMarker.data[index] });
      });
    }
    return values;
  }

  private get tableColumns() {
    return [
      {
        field: "label",
        headerName: "Label"
      },
      {
        field: "value",
        headerName: "Value"
      }
    ];
  }

  private select(): void {
    /**
     * Tell the parent to select this marker
     *
     * @type {string}
     */
    this.$emit("select", [this.clickedMarker.id]);
  }

  private deselect(): void {
    /**
     * Tell the parent to deselect this marker
     *
     * @type {string}
     */
    this.$emit("deselect", [this.clickedMarker.id]);
  }

  private close(): void {
    /**
     * Tell the parent to close this preview
     *
     * @type {string}
     */
    this.$emit("close");
  }

  private gridReady(config: { api: GridApi }) {
    config.api.sizeColumnsToFit();
  }
}
</script>
<style lang='scss' scoped>
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-balham.css";
#street-view {
  height: 300px;
}
.width-50 {
  width: 50%;
}
.full-height {
  height: 100%;
}
</style>
