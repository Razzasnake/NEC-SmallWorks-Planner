<template>
  <div class="card full-height">
    <header class="card-header">
      <b-button @click="close" expanded class="close-button">Close</b-button>
    </header>
    <div class="preview-card-content">
      <div id="street-view"></div>
      <AgGridVue
        class="ag-grid ag-theme-balham"
        v-model="tableData"
        :columnDefs="tableColumns"
        :defaultColDef="colDef"
        suppressMenuHide
        domLayout="autoHeight"
        @gridReady="gridReady"
      ></AgGridVue>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import { AgGridVue } from "@ag-grid-community/vue";
import { GridApi, ColDef, ColumnApi } from "@ag-grid-community/core";
import Utils from "@/components/TableAndMap/GoogleMap/Utils";
import { defaultColDef } from "../Table/TableLogic";

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
  private colDef: ColDef = defaultColDef;
  private tableData: {
    label: string;
    value: string;
  }[] = [];
  private tableColumns = [
    {
      field: "label",
      headerName: "Label"
    },
    {
      field: "value",
      headerName: "Value"
    }
  ];

  private created() {
    Utils.injectGoogleMapsLibrary([]).then(google => {
      this.updatePanorama();
    });
    this.updateTableData();
  }

  @Watch("clickedMarker")
  private clickedMarkerChanged() {
    this.updatePanorama();
    this.updateTableData();
  }

  private updatePanorama(): void {
    this.panorama = null;
    const el = document.getElementById("street-view");
    if (el && this.clickedMarker.lat && this.clickedMarker.lng) {
      el.innerHTML = "";
      var svService = new google.maps.StreetViewService();
      var panoRequest = {
        location: { lat: this.clickedMarker.lat, lng: this.clickedMarker.lng },
        preference: google.maps.StreetViewPreference.NEAREST,
        radius: 50,
        source: google.maps.StreetViewSource.OUTDOOR
      };
      const findPanorama = (radius: number) => {
        panoRequest.radius = radius;
        svService.getPanorama(panoRequest, (panoData, status) => {
          if (
            status === google.maps.StreetViewStatus.OK &&
            panoData &&
            panoData.location
          ) {
            this.panorama = new google.maps.StreetViewPanorama(el, {
              pano: panoData.location.pano,
              panControl: false,
              zoomControl: false,
              fullscreenControl: false,
              addressControl: false
            });
          } else {
            if (radius > 200) {
              el.innerHTML = "No Street View Available";
              this.panorama = null;
            } else {
              findPanorama(radius * 2);
            }
          }
        });
      };
      findPanorama(50);
    }
  }

  private updateTableData() {
    let values: { label: string; value: string }[] = [];
    if (this.uploadedFile.firstRowHeader) {
      this.uploadedFile.data[0].data.forEach((key, index) => {
        values.push({
          label: (key || "").toString(),
          value: (this.clickedMarker.data[index] || "").toString()
        });
      });
    } else {
      this.uploadedFile.data[0].data.forEach((_, index) => {
        const key = `Column ${index.toString()}`;
        values.push({
          label: (key || "").toString(),
          value: (this.clickedMarker.data[index] || "").toString()
        });
      });
    }
    this.tableData = values;
  }

  private close(): void {
    /**
     * Tell the parent to close this preview
     *
     * @type {string}
     */
    this.$emit("close");
  }

  private gridReady(config: { api: GridApi; columnApi: ColumnApi }) {
    config.columnApi.autoSizeColumns(["label"]);
    config.api.sizeColumnsToFit();
  }
}
</script>
<style lang='scss' scoped>
@import "~@ag-grid-community/core/dist/styles/ag-grid.css";
@import "~@ag-grid-community/core/dist/styles/ag-theme-balham.css";
.preview-card-content {
  height: calc(100% - 36px);
  overflow: auto;
  #street-view {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: rgb(229, 227, 223);
    overflow: hidden;
  }
}
.close-button {
  border-radius: 0px;
}
</style>
