<template>
  <div class="google-map-container">
    <v-btn
      v-if="allowDraw"
      v-show="mapLogic.selectedOverlayEvent"
      :id="`delete-button-${mapLogic.mapId}`"
      class="delete-button"
      small
      color="white"
    >Delete Boundary</v-btn>
    <div class="google-map" :id="mapLogic.mapId" />
    <div class="upload-layer" title="Upload geojson or zipped shapefile">
      <v-file-input
        @change="shapefilesUploaded"
        multiple
        prepend-icon="mdi-layers"
        hide-input
        accept=".json, .geojson, .zip"
      />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import Utils from "./Utils";
import GoogleMapLogic from "./GoogleMapLogic";

/**
 * Display the rows that have been uploaded.
 */
@Component({
  components: {}
})
export default class GoogleMap extends Vue {
  /**
   * The uploaded file to display on the map
   */
  @Prop()
  public uploadedFile!: UploadedFile;
  /**
   * All of the polygons being displayed on the map
   */
  @Prop({ default: () => [] })
  public overlayEvents!: google.maps.drawing.OverlayCompleteEvent[];
  /**
   * Function that creates a google maps info window, passed in to keep class generic
   */
  @Prop({ default: () => null })
  public createInfoWindow!: (
    marker: google.maps.Marker,
    row: Row
  ) => google.maps.InfoWindow;
  /**
   * Whether or not to allow the user to draw polygons on the map
   */
  @Prop({ type: Boolean, default: true })
  public allowDraw!: boolean;
  /**
   * A Set of indices of objects to hide
   */
  @Prop({ default: () => new Set() })
  public hiddenMarkerIndices!: Set<number>;
  /**
   * Whether or not to display a heatmap
   */
  @Prop({ type: Boolean, default: false })
  public displayHeatmap!: boolean;
  /**
   * Whether or not to display the markers
   */
  @Prop({ type: Boolean, default: false })
  public displayMarkers!: boolean;
  /**
   * Whether or not to display markers using clusters. Nice when there are a lot of markers.
   */
  @Prop({ type: Boolean, default: false })
  public displayClusters!: boolean;
  /**
   * The row that has been clicked if there is one
   */
  @Prop({ default: null })
  public clickedMarker!: Row | null;

  private mapLogic!: GoogleMapLogic;

  @Watch("uploadedFile")
  private updateUploadedFile(): void {
    this.mapLogic.initMarkers();
  }

  @Watch("overlayEvents", { deep: true })
  private updateOverlayEvents(): void {
    this.mapLogic.initOverlayEvents();
  }

  @Watch("hiddenMarkerIndices")
  private updateHiddenMarkerIndices(
    newVals: Set<number>,
    oldVals: Set<number>
  ) {
    this.mapLogic.hiddenMarkerIndicesUpdated(newVals, oldVals);
  }

  @Watch("displayHeatmap")
  private updateDisplayHeatmap() {
    this.mapLogic.displayHeatmapChanged();
  }

  @Watch("displayMarkers")
  private updateDisplayMarkers() {
    this.mapLogic.displayMarkersChanged();
  }

  @Watch("displayClusters")
  private updateDisplayClusters() {
    this.mapLogic.displayClustersChanged();
  }

  @Watch("clickedMarker")
  private updateClickedMarker() {
    this.mapLogic.clickedMarkerChanged();
  }

  private created(): void {
    this.mapLogic = new GoogleMapLogic(this);
    Utils.injectGoogleMapsLibrary(
      this.allowDraw ? ["drawing", "visualization"] : []
    ).then(() => {
      const mapEl = document.getElementById(this.mapLogic.mapId);
      if (mapEl) {
        this.mapLogic.createMap(mapEl);
        this.mapLogic.initMarkers();
      }
    });
  }

  private shapefilesUploaded(fileArray: File[]) {
    this.mapLogic.shapefilesUploaded(fileArray);
  }

  private beforeDestroy(): void {
    this.mapLogic.beforeDestroy();
  }
}
</script>
<style lang='scss' scoped>
.google-map-container {
  height: 100%;
  position: relative;
}
.delete-button {
  position: absolute;
  margin: 5px;
  z-index: 10;
  top: -1px;
  left: 120px;
}
.upload-layer {
  position: absolute;
  top: -12px;
  right: 7px;
  z-index: 10;
}
</style>
<style lang='scss'>
.google-map {
  width: 100%;
  height: 100%;
  .gmnoprint:nth-child(10) {
    div {
      cursor: pointer;
      span {
        margin: 2px;
      }
    }
  }
  .custom-clustericon {
    background: var(--cluster-color);
    color: #fff;
    border-radius: 100%;
    font-weight: bold;
    font-size: 15px;
    display: flex;
    align-items: center;
  }
  .custom-clustericon::before,
  .custom-clustericon::after {
    content: "";
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background: var(--cluster-color);
    opacity: 0.2;
    border-radius: 100%;
  }
  .custom-clustericon::before {
    width: calc(100% + 14px);
    height: calc(100% + 14px);
  }
  .custom-clustericon::after {
    width: calc(100% + 28px);
    height: calc(100% + 28px);
  }
  .custom-clustericon-1 {
    --cluster-color: #00a2d3;
  }
  .custom-clustericon-2 {
    --cluster-color: #ff9b00;
  }
  .custom-clustericon-3 {
    --cluster-color: #ff6969;
  }
}
</style>
