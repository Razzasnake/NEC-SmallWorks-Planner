<template>
  <div class="google-map-container">
    <b-button
      v-if="allowDraw"
      v-show="selectedOverlayEvent"
      :id="`delete-button-${mapId}`"
      class="delete-button"
      size="mini"
      icon="el-icon-delete"
    >Delete Boundary</b-button>
    <div class="google-map" :id="mapId" />
    <div class="upload-layer">
      <b-upload @input="shapefileUploaded" accept=".json,.geojson,.zip">
        <font-awesome-icon icon="layer-group" title="Upload a shapefile" />
      </b-upload>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import Utils from "./Utils";
import Theme from "./Theme";
import MarkerClusterer from "@google/markerclustererplus";
import LayerParser from "worker-loader!./LayerParsers/Parser";

type AvailableOverlays =
  | google.maps.Polygon
  | google.maps.Rectangle
  | google.maps.Circle;

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
  private uploadedFile!: UploadedFile;
  /**
   * All of the polygons being displayed on the map
   */
  @Prop({ default: () => [] })
  private overlayEvents!: google.maps.drawing.OverlayCompleteEvent[];
  /**
   * Function that creates a google maps info window, passed in to keep class generic
   */
  @Prop({ default: () => null })
  private createInfoWindow!: (
    marker: google.maps.Marker,
    row: Row
  ) => google.maps.InfoWindow;
  /**
   * Whether or not to allow the user to draw polygons on the map
   */
  @Prop({ type: Boolean, default: true })
  private allowDraw!: boolean;
  /**
   * A Set of indices of objects to hide
   */
  @Prop({ default: () => new Set() })
  private hiddenMarkerIndices!: Set<number>;
  /**
   * Whether or not to display a heatmap
   */
  @Prop({ type: Boolean, default: false })
  private displayHeatmap!: boolean;
  /**
   * Whether or not to display the markers
   */
  @Prop({ type: Boolean, default: false })
  private displayMarkers!: boolean;
  /**
   * Whether or not to display markers using clusters. Nice when there are a lot of markers.
   */
  @Prop({ type: Boolean, default: false })
  private displayClusters!: boolean;
  /**
   * The row that has been clicked if there is one
   */
  @Prop({ default: null })
  private clickedMarker!: Row | null;

  private map!: google.maps.Map;
  private drawingManager!: google.maps.drawing.DrawingManager;
  private markers: google.maps.Marker[] = [];
  private markerCluster: MarkerClusterer | null = null;
  private heatmap: google.maps.visualization.HeatmapLayer | null = null;
  private activeOverlays: AvailableOverlays[] = [];
  private selectedOverlayEvent: google.maps.drawing.OverlayCompleteEvent | null = null;
  private clickedInfoWindow: google.maps.InfoWindow | null = null;
  private mapId = Math.random()
    .toString(36)
    .substring(7);

  private polyOptions = {
    strokeWeight: 2,
    strokeColor: "#10546A",
    fillColor: "#ECECEC",
    fillOpacity: 0.5,
    editable: true,
    draggable: false,
    zIndex: 2
  };

  @Watch("hiddenMarkerIndices")
  private hiddenMarkerIndicesUpdated(
    newVals: Set<number>,
    oldVals: Set<number>
  ) {
    oldVals.forEach(index => {
      if (!newVals.has(index) && this.markers[index]) {
        this.markers[index].setVisible(true);
      }
    });
    newVals.forEach(index => {
      if (!oldVals.has(index) && this.markers[index]) {
        this.markers[index].setVisible(false);
      }
    });
    if (newVals.size || oldVals.size) {
      this.displayHeatmapChanged();
      this.displayClustersChanged();
    }
  }

  @Watch("overlayEvents", { deep: true })
  private initOverlayEvents(): void {
    this.clearOverlays();
    this.overlayEvents.forEach(event => {
      event.overlay.setOptions(this.polyOptions);
      event.overlay.setMap(this.map);
      this.onOverlayComplete(event, false);
    });
    this.clearSelection();
  }

  @Watch("uploadedFile")
  private initMarkers(): void {
    this.clearMarkers();
    const drawnMarkers: google.maps.Marker[] = [];
    this.uploadedFile.data
      .slice(this.uploadedFile.firstRowHeader ? 1 : 0)
      .forEach((row, index) => {
        if (row.lat === null || row.lng === null) {
          drawnMarkers.push(new google.maps.Marker());
          return;
        }
        const position = { lat: row.lat!, lng: row.lng! };
        const newMarker = this.createMarker(position);
        newMarker.addListener("click", () => {
          if (this.map) {
            this.map.panTo(position);
            /**
             * Notify the parent of the marker that has been clicked
             *
             * @type {string}
             */
            this.$emit("markerSelected", row.id);
          }
        });
        this.addInfoWindow(newMarker, row);
        if (this.hiddenMarkerIndices.has(index)) {
          newMarker.setVisible(false);
        }
        drawnMarkers.push(newMarker);
      });
    this.markers = drawnMarkers;
  }

  @Watch("displayClusters")
  private displayClustersChanged() {
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster = null;
    }
    if (this.displayClusters) {
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
      this.markerCluster = new MarkerClusterer(
        this.map,
        this.markers.filter(_ => _.getVisible()),
        {
          maxZoom: 12,
          clusterClass: "custom-clustericon",
          styles: [
            {
              width: 30,
              height: 30,
              className: "custom-clustericon-1"
            },
            {
              width: 40,
              height: 40,
              className: "custom-clustericon-2"
            },
            {
              width: 50,
              height: 50,
              className: "custom-clustericon-3"
            }
          ]
        }
      );
    } else {
      this.displayMarkersChanged();
    }
  }

  @Watch("displayHeatmap")
  private displayHeatmapChanged() {
    if (this.heatmap) {
      this.heatmap.setMap(null);
    }
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.markers
        .filter((_, index) => {
          return !this.hiddenMarkerIndices.has(index);
        })
        .map(_ => {
          return { location: _.getPosition() };
        })
    });
    if (this.displayHeatmap && this.heatmap) {
      this.heatmap.setMap(this.map);
    }
  }

  @Watch("displayMarkers")
  private displayMarkersChanged() {
    if (this.displayMarkers && !this.displayClusters) {
      this.markers.forEach(marker => {
        marker.setMap(this.map);
      });
    } else {
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
    }
  }

  @Watch("clickedMarker")
  private clickedMarkerChanged() {
    if (this.clickedInfoWindow) {
      this.clickedInfoWindow.close();
      this.clickedInfoWindow = null;
    }
    if (this.clickedMarker) {
      const offset = this.uploadedFile.firstRowHeader ? 1 : 0;
      const selectedMarker = this.markers[this.clickedMarker.index - offset];
      if (selectedMarker) {
        this.map.panTo(selectedMarker.getPosition()!);
        this.clickedInfoWindow = this.createInfoWindow(
          selectedMarker,
          this.clickedMarker
        );
        if (this.clickedInfoWindow) {
          this.clickedInfoWindow.open(this.map, selectedMarker);
        }
      }
    }
  }

  private createMarker(position: { lat: number; lng: number }) {
    return new google.maps.Marker({
      position,
      zIndex: 1,
      map: this.displayClusters ? undefined : this.map,
      icon: require("@/assets/markers/point.png")
    });
  }

  private addInfoWindow(marker: google.maps.Marker, row: Row): void {
    if (this.createInfoWindow) {
      let infoWindow: google.maps.InfoWindow | null = null;
      marker.addListener("mouseover", () => {
        infoWindow = this.createInfoWindow(marker, row);
        if (infoWindow) {
          infoWindow.open(this.map, marker);
        }
      });
      marker.addListener("mouseout", () => {
        if (infoWindow) {
          infoWindow.close();
        }
        infoWindow = null;
      });
    }
  }

  private created(): void {
    Utils.injectGoogleMapsLibrary(
      this.allowDraw ? ["drawing", "visualization"] : []
    ).then(google => {
      const mapEl = document.getElementById(this.mapId);
      if (!mapEl) {
        return;
      }
      this.map = new google.maps.Map(mapEl, {
        center: new google.maps.LatLng(39.8283, -98.5795),
        zoom: 5,
        disableDefaultUI: true,
        clickableIcons: false,
        zoomControl: true,
        gestureHandling: "greedy",
        styles: Theme
      });
      google.maps.event.addListener(this.map, "idle", () => {
        this.markers.forEach((marker, index) => {
          if (this.hiddenMarkerIndices.has(index)) {
            return;
          }
          const newValue = this.map
            .getBounds()!
            .contains(marker.getPosition()!);
          if (marker.getVisible() !== newValue) {
            marker.setVisible(newValue);
          }
        });
      });
      this.initMarkers();
      this.updateBounds();
      this.displayHeatmapChanged();
      this.displayClustersChanged();
      this.displayMarkersChanged();
      if (this.allowDraw) {
        this.initDrawingManager();
        this.initDrawListeners();
        this.initOverlayEvents();
      }
    });
  }

  private shapefileUploaded(file: File) {
    const worker = new LayerParser();
    worker.postMessage(file);
    worker.onmessage = event => {
      this.map.data.addGeoJson(event.data);
      this.map.data.setStyle({
        strokeWeight: 2,
        strokeColor: "#00a2d3",
        fillColor: "#00a2d3",
        zIndex: 2
      });
    };
  }

  private updateBounds() {
    const bounds = new google.maps.LatLngBounds();
    this.markers
      .filter((_, index) => !this.hiddenMarkerIndices.has(index))
      .forEach(marker => {
        const pos = marker.getPosition();
        if (pos && pos.lat() && pos.lng()) {
          bounds.extend(pos);
        }
      });
    this.map.fitBounds(bounds);
  }

  private initDrawingManager(): void {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControlOptions: {
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      drawingControl: true,
      rectangleOptions: this.polyOptions,
      circleOptions: this.polyOptions,
      polygonOptions: this.polyOptions,
      map: this.map
    });
  }

  private initDrawListeners(): void {
    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      this.onOverlayComplete
    );
    google.maps.event.addListener(
      this.drawingManager,
      "drawingmode_changed",
      this.clearSelection
    );
    google.maps.event.addListener(this.map, "click", this.clearSelection);
    const deleteEl = document.getElementById(`delete-button-${this.mapId}`);
    if (deleteEl) {
      google.maps.event.addDomListener(
        deleteEl,
        "click",
        this.deleteSelectedOverlay
      );
    }
    document.addEventListener("keydown", e => {
      if (e.keyCode === 8 || e.keyCode === 46) {
        this.deleteSelectedOverlay();
      }
    });
  }

  private onOverlayComplete(
    newEvent: google.maps.drawing.OverlayCompleteEvent,
    emit: boolean = true
  ): void {
    const newOverlay = newEvent.overlay as AvailableOverlays;
    this.drawingManager.setDrawingMode(null);
    newOverlay.addListener("click", () => {
      this.clearSelection();
      newOverlay.setEditable(true);
      newOverlay.setDraggable(true);
      this.selectedOverlayEvent = newEvent;
    });
    if (newEvent.type === google.maps.drawing.OverlayType.POLYGON) {
      this.setPolygonListeners(newOverlay as google.maps.Polygon);
    } else if (newEvent.type === google.maps.drawing.OverlayType.RECTANGLE) {
      this.setRectangleListeners(newOverlay as google.maps.Rectangle);
    } else if (newEvent.type === google.maps.drawing.OverlayType.CIRCLE) {
      this.setCircleListeners(newOverlay as google.maps.Circle);
    }
    this.selectedOverlayEvent = newEvent;
    if (emit) {
      /**
       * Notify the parent of all of the polygons currently being displayed on the map
       *
       * @type {google.maps.drawing.OverlayCompleteEvent[]}
       */
      this.$emit("updateOverlayEvents", this.overlayEvents.concat(newEvent));
    }
    this.activeOverlays.push(newOverlay);
  }

  private setPolygonListeners(newOverlay: google.maps.Polygon): void {
    newOverlay.addListener("dragstart", () => {
      newOverlay.getPaths().forEach(path => {
        google.maps.event.clearListeners(path, "set_at");
      });
    });
    newOverlay.addListener("dragend", () => {
      newOverlay.getPaths().forEach(path => {
        google.maps.event.addListener(path, "set_at", () =>
          this.$emit("updateOverlayEvents", this.overlayEvents)
        );
      });
      this.$emit("updateOverlayEvents", this.overlayEvents);
    });
    newOverlay.getPaths().forEach(path => {
      google.maps.event.addListener(path, "insert_at", () =>
        this.$emit("updateOverlayEvents", this.overlayEvents)
      );
      google.maps.event.addListener(path, "set_at", () =>
        this.$emit("updateOverlayEvents", this.overlayEvents)
      );
      google.maps.event.addListener(path, "remove_at", () =>
        this.$emit("updateOverlayEvents", this.overlayEvents)
      );
    });
  }

  private setRectangleListeners(newOverlay: google.maps.Rectangle): void {
    newOverlay.addListener("dragstart", () => {
      google.maps.event.clearListeners(newOverlay, "bounds_changed");
    });
    newOverlay.addListener("dragend", () => {
      newOverlay.addListener("bounds_changed", () =>
        this.$emit("updateOverlayEvents", this.overlayEvents)
      );
      this.$emit("updateOverlayEvents", this.overlayEvents);
    });
    newOverlay.addListener("bounds_changed", () =>
      this.$emit("updateOverlayEvents", this.overlayEvents)
    );
  }

  private setCircleListeners(newOverlay: google.maps.Circle): void {
    newOverlay.addListener("dragstart", () => {
      google.maps.event.clearListeners(newOverlay, "center_changed");
    });
    newOverlay.addListener("dragend", () => {
      newOverlay.addListener("center_changed", () =>
        this.$emit("updateOverlayEvents", this.overlayEvents)
      );
      this.$emit("updateOverlayEvents", this.overlayEvents);
    });
    newOverlay.addListener("center_changed", () =>
      this.$emit("updateOverlayEvents", this.overlayEvents)
    );
    newOverlay.addListener("radius_changed", () =>
      this.$emit("updateOverlayEvents", this.overlayEvents)
    );
  }

  private clearSelection(): void {
    if (this.selectedOverlayEvent) {
      const overlay = this.selectedOverlayEvent.overlay as AvailableOverlays;
      overlay.setEditable(false);
      overlay.setDraggable(false);
      this.selectedOverlayEvent = null;
    }
  }

  private deleteSelectedOverlay(): void {
    if (this.selectedOverlayEvent) {
      const overlayIndex = this.overlayEvents.findIndex(
        _ => _.overlay === this.selectedOverlayEvent!.overlay
      );
      if (overlayIndex >= 0) {
        const newOverlayEvents = this.overlayEvents
          .slice(0, overlayIndex)
          .concat(this.overlayEvents.slice(overlayIndex + 1));
        this.$emit("updateOverlayEvents", newOverlayEvents);
        this.selectedOverlayEvent.overlay.setMap(null);
        this.selectedOverlayEvent = null;
      }
    }
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    this.markers = [];
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster = null;
    }
  }

  private clearOverlays(): void {
    this.activeOverlays.forEach(overlay => {
      google.maps.event.clearInstanceListeners(overlay);
      overlay.setMap(null);
    });
    this.activeOverlays = [];
  }

  private beforeDestroy(): void {
    this.clearMarkers();
    this.clearOverlays();
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
  font-size: 13px;
}
.upload-layer {
  position: absolute;
  top: 5px;
  right: 6px;
  z-index: 10;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 2px;
  color: grey;
  * {
    cursor: pointer;
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
