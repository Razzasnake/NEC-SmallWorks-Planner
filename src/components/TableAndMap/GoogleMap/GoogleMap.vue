<template>
  <div class="google-map-container">
    <div
      :id="mapLogic.mapId"
      class="google-map"
    />
    <v-btn-toggle
      v-if="!isEmbed"
      class="drawing-manager"
      :value="mapLogic.activeDrawingMode"
    >
      <v-btn
        v-for="(d, index) in drawingOptions"
        :key="index"
        x-small
        fab
        :title="d.title"
        @click="mapLogic.setDrawingManager(index)"
      >
        <v-icon :color="mapLogic.iconColor">
          {{ d.icon }}
        </v-icon>
      </v-btn>
      <v-btn
        v-if="mapLogic.selectedOverlayEvent"
        x-small
        fab
        title="Delete selected shape"
        @click="deleteSelectedOverlay"
      >
        <v-icon color="error">
          {{ mdiDelete }}
        </v-icon>
      </v-btn>
    </v-btn-toggle>
    <div
      v-else
      class="affiliation"
    >
      <a
        :href="rootUrl"
        target="_blank"
      >Powered by Table & Map</a>
    </div>
    <v-card
      v-if="mapLogic.colorPosition"
      class="legend"
    >
      <template
        v-for="key in Object.keys(mapLogic.colorPosition).filter(key => mapLogic.visibleCategories.has(key))"
      >
        <div
          :key="key"
          :style="`background-color: ${mapLogic.materialColors[mapLogic.colorPosition[key]].hash};`"
        >
          {{ key }}
        </div>
      </template>
    </v-card>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import GoogleMapLogic from "./Logic/GoogleMapLogic";
import {
  mdiHandBackRightOutline,
  mdiCircleOutline,
  mdiVectorPolygon,
  mdiSquareOutline,
  mdiDelete,
} from "@mdi/js";

/**
 * Display the rows that have been uploaded.
 */
@Component({
  name: "TableAndMapGoogleMap",
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
  @Prop({ default: Array() })
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
   * A Set of indices of objects to hide
   */
  @Prop({ default: new Set() })
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
  /**
   * Categorical column to use to determine the marker color and pie chart when clusters are activated.
   */
  @Prop({ default: null })
  private groupByKey!: number | null;
  /**
   * All of the uploaded geojson and shapefile layers
   */
  @Prop({ default: Array() })
  private layers!: { id: string, fileName: string, data: object | null }[];

  private mapLogic!: GoogleMapLogic;

  private drawingOptions = [
    { title: "Stop drawing", icon: mdiHandBackRightOutline },
    { title: "Draw a circle", icon: mdiCircleOutline },
    { title: "Draw a shape", icon: mdiVectorPolygon },
    { title: "Draw a rectangle", icon: mdiSquareOutline },
  ];
  private mdiDelete = mdiDelete;

  private get isEmbed() {
    return this.$route && this.$route.name === "Embed";
  }

  private get rootUrl() {
    return process.env.VUE_APP_BASE_URL;
  }

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

  @Watch("groupByKey")
  private updateGroupByKey() {
    this.mapLogic.updateMarkerImages();
  }

  @Watch("layers")
  private updateLayers() {
    this.mapLogic.updateLayers();
  }

  private created(): void {
    this.mapLogic = Vue.observable(new GoogleMapLogic(this));
    this.mapLogic.createMap();
  }

  private deleteSelectedOverlay() {
    this.mapLogic.deleteSelectedOverlay();
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
.drawing-manager {
  position: absolute;
  top: 5px;
  left: 5px;
}
.affiliation {
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(255, 255, 255, .60);
  padding-left: 6px;
  padding-right: 6px;
  font-size: 10px;
  a {
    text-decoration: none;
  }
}
.legend {
  position: absolute;
  bottom: 30px;
  left: 5px;
  max-height: calc(100% - 70px);
  max-width: 200px;
  overflow: auto;
  div {
    color: white;
    padding: 8px;
  }
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
    --cluster-color: #1e88e5;
  }
  .custom-clustericon-2 {
    --cluster-color: #fb8c00;
  }
  .custom-clustericon-3 {
    --cluster-color: #ef5350;
  }
}
</style>
