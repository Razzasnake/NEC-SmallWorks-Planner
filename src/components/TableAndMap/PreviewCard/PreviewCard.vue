<template>
  <v-dialog
    v-model="visible"
    max-width="1600"
    scrollable
    @click:outside="close"
  >
    <v-card>
      <div id="street-view" />
      <v-card-text class="full-height">
        <v-row>
          <v-col>
            <h6 class="text-h6">
              Marker
            </h6>
            <div>
              <AgGridVue
                v-model="markerData"
                class="ag-theme-balham"
                dom-layout="autoHeight"
                row-buffer="9999"
                :column-defs="tableColumns"
                :modules="modules"
                :default-col-def="colDef"
                suppress-menu-hide
                suppress-column-virtualisation
                enable-cell-text-selection
                @grid-ready="gridReady"
              />
            </div>
          </v-col>
          <v-col
            v-for="(feature, index) in featureTables"
            :key="index"
          >
            <h6 class="text-h6">
              Feature - {{ feature.name }}
            </h6>
            <AgGridVue
              v-model="feature.data"
              class="ag-theme-balham"
              dom-layout="autoHeight"
              row-buffer="9999"
              :column-defs="tableColumns"
              :modules="modules"
              :default-col-def="colDef"
              suppress-menu-hide
              suppress-column-virtualisation
              enable-cell-text-selection
              @grid-ready="gridReady"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="$emit('close')"
        >
          Close
        </v-btn>
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
import state, { updateFeature } from "@/store/exploreStore";
import PolygonRelationWorker from "worker-loader!@/store/WebWorkers/PolygonRelation.worker";

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
          const properties = (feature.features[0] as any).properties;
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
      this.clickedMarker.features.forEach((feature) => {
        if (feature.features === null) {
          const features = (state.layers.find((_) => _.id === feature.id)!
            .data as any).features;
          const fkWorker = new PolygonRelationWorker();
          fkWorker.postMessage({
            markers: [[this.clickedMarker.lng, this.clickedMarker.lat]],
            features,
          });
          fkWorker.onmessage = (event) => {
            const polygonIndices: number[] = event.data.polygonIndices;
            feature.features = polygonIndices.map((index) => features[index]);
            fkWorker.terminate();
          };
        }
      });
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
