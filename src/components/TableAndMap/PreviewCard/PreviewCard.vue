<template>
  <v-dialog v-model="visible" @click:outside="close" max-width="1600" scrollable>
    <v-card>
      <div id="street-view"></div>
      <v-card-text class="full-height">
        <v-row>
          <v-col>
            <div class="text-h6">Marker</div>
            <div>
              <AgGridVue
                class="ag-theme-balham"
                domLayout="autoHeight"
                rowBuffer="9999"
                v-model="markerData"
                :columnDefs="tableColumns"
                :modules="modules"
                :defaultColDef="colDef"
                @gridReady="gridReady"
                suppressMenuHide
                suppressColumnVirtualisation
                enableCellTextSelection
              ></AgGridVue>
            </div>
          </v-col>
          <v-col v-for="(feature, index) in featureTables" :key="index">
            <div class="text-h6">Feature - {{ feature.name }}</div>
            <AgGridVue
              class="ag-theme-balham"
              domLayout="autoHeight"
              rowBuffer="9999"
              v-model="feature.data"
              :columnDefs="tableColumns"
              :modules="modules"
              :defaultColDef="colDef"
              @gridReady="gridReady"
              suppressMenuHide
              suppressColumnVirtualisation
              enableCellTextSelection
            ></AgGridVue>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close')" color="primary">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import { AgGridVue } from "@ag-grid-community/vue";
import { GridApi, ColDef, ColumnApi } from "@ag-grid-community/core";
import Utils from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import { defaultColDef } from "../Table/Logic/TableLogic";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

/**
 * Display a preview of the marker/row that has been clicked.
 */
@Component({
  components: {
    AgGridVue,
  },
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
  private tableColumns = [
    {
      field: "label",
      headerName: "Label",
    },
    {
      field: "value",
      headerName: "Value",
      flex: 1,
    },
  ];
  private modules = [ClientSideRowModelModule];
  private visible = true;

  private get markerData() {
    let values: { label: string; value: string }[] = [];
    if (this.uploadedFile.firstRowHeader) {
      this.uploadedFile.data[0].data.forEach((key, index) => {
        values.push({
          label: (key || "").toString(),
          value: (this.clickedMarker.data[index] || "").toString(),
        });
      });
    } else {
      this.uploadedFile.data[0].data.forEach((_, index) => {
        const key = `Column ${index.toString()}`;
        values.push({
          label: (key || "").toString(),
          value: (this.clickedMarker.data[index] || "").toString(),
        });
      });
    }
    return values;
  }

  private get featureTables() {
    return this.clickedMarker.features.map((feature) => {
      if (feature.features === null) {
        return { name: feature.name, data: null };
      } else {
        let values: { label: string; value: string }[] = [];
        if (feature.features.length > 0) {
          const properties = (feature.features[0] as any).properties
          Object.entries(properties).forEach(([name, value]: [any, any]) => {
            if (name !== "Table_Map_Id") {
              values.push({
                label: (name || "").toString(),
                value: (value || "").toString(),
              });
            }
          });
        }
        return { name: feature.name, data: values };
      }
    });
  }

  private created() {
    Utils.injectGoogleMapsLibrary([]).then((google) => {
      this.updatePanorama();
    });
  }

  private gridReady(config: { api: GridApi; columnApi: ColumnApi }) {
    config.columnApi.autoSizeAllColumns();
    const label: any = config.columnApi.getColumn("label");
    const value: any = config.columnApi.getColumn("value");
    label.minWidth = label.getActualWidth();
    value.minWidth = value.getActualWidth();
    value.setFlex(1);
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
        source: google.maps.StreetViewSource.OUTDOOR,
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
              addressControl: false,
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

  private close(): void {
    /**
     * Tell the parent to close this preview
     *
     * @type {string}
     */
    this.$emit("close");
  }
}
</script>
<style lang='scss' scoped>
@import "~@ag-grid-community/core/dist/styles/ag-grid.css";
@import "~@ag-grid-community/core/dist/styles/ag-theme-balham.css";
#street-view {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: rgb(229, 227, 223);
  overflow: hidden;
}
.ag-theme-balham {
  min-width: 400px;
}
@media (max-width: 600px) {
  .ag-theme-balham {
    min-width: 200px;
  }
}
</style>
