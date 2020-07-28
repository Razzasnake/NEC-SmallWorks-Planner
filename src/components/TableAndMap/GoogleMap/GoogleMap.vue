<template>
  <div class="google-map-container">
    <div class="google-map" :id="mapLogic.mapId" />
    <v-btn-toggle class="drawing-manager" :value="mapLogic.activeDrawingMode">
      <v-btn x-small fab title="Stop drawing" @click="mapLogic.setDrawingManager(0)">
        <v-icon>mdi-hand-right</v-icon>
      </v-btn>
      <v-btn x-small fab title="Draw a circle" @click="mapLogic.setDrawingManager(1)">
        <v-icon>mdi-circle-outline</v-icon>
      </v-btn>
      <v-btn x-small fab title="Draw a shape" @click="mapLogic.setDrawingManager(2)">
        <v-icon>mdi-vector-polygon</v-icon>
      </v-btn>
      <v-btn x-small fab title="Draw a rectangle" @click="mapLogic.setDrawingManager(3)">
        <v-icon>mdi-square-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="mapLogic.selectedOverlayEvent"
        x-small
        fab
        title="Delete selected shape"
        @click="deleteSelectedOverlay"
      >
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-btn
      class="upload-layer"
      title="Upload geojson or zipped shapefile"
      @click="openUpload"
      fab
      x-small
    >
      <v-icon>mdi-layers</v-icon>
      <input
        accept=".json, .geojson, .zip"
        ref="input"
        type="file"
        style="display: none"
        @change="shapefilesUploaded($event.target.files)"
      />
    </v-btn>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import GoogleMapLogic from "./Logic/GoogleMapLogic";

/**
 * Display the rows that have been uploaded.
 */
@Component({
  components: {},
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
    this.mapLogic = Vue.observable(new GoogleMapLogic(this));
    this.mapLogic.createMap();
  }

  private shapefilesUploaded(fileArray: FileList) {
    this.mapLogic.shapefilesUploaded(Array.from(fileArray));
  }

  private deleteSelectedOverlay() {
    this.mapLogic.deleteSelectedOverlay();
  }

  private beforeDestroy(): void {
    this.mapLogic.beforeDestroy();
  }

  private openUpload() {
    (this.$refs.input as HTMLInputElement).click();
  }
}
</script>
<style lang='scss' scoped>
.google-map-container {
  height: 100%;
  position: relative;
}
.drawing-manager {
  position: absolute;
  top: 5px;
  left: 5px;
}
.upload-layer {
  position: absolute;
  top: 5px;
  right: 5px;
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
    --cluster-color: #1E88E5;
  }
  .custom-clustericon-2 {
    --cluster-color: #FB8C00;
  }
  .custom-clustericon-3 {
    --cluster-color: #EF5350;
  }
}
</style>
