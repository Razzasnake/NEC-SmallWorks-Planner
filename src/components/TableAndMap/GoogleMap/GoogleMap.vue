<template>
  <div style="height: 100%; position: relative;">
    <b-button
      v-if="allowDraw"
      v-show="selectedOverlayEvent"
      :id="`delete-button-${mapId}`"
      class="delete-button"
      size="mini"
      icon="el-icon-delete"
    >Delete Boundary</b-button>
    <div class="card summary">
      <!-- @slot Slot for the summary in the top-right of the map. -->
      <slot name="summary">
        <table>
          <tr v-for="(x, index) in summary" :key="index">
            <td>{{ x.label }}</td>
            <td align="right">{{ x.value }}</td>
          </tr>
        </table>
      </slot>
    </div>
    <div class="google-map" :id="mapId" />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Loader } from "google-maps";
import { Row } from "@/entities/UploadedFile";

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
  @Prop({ default: () => [] })
  private rowData!: Row[];
  /**
   * All of the polygons being displayed on the map
   */
  @Prop({ default: () => [] })
  private overlayEvents!: google.maps.drawing.OverlayCompleteEvent[];
  /**
   * Data to display in the top-right of map with high level aggregated data
   */
  @Prop({ default: () => [] })
  private summary!: { label: string; value: string }[];
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
  @Prop({ default: true })
  private allowDraw!: boolean;
  /**
   * A Set of indices of objects to hide
   */
  @Prop({ default: () => new Set() })
  private hiddenMarkerIndices!: Set<number>;
  /**
   * A Set of indices of objects to show as displayed
   */
  @Prop({ default: () => new Set() })
  private selectedMarkerIndices!: Set<number>;

  private map!: google.maps.Map;
  private drawingManager!: google.maps.drawing.DrawingManager;
  private markers: google.maps.Marker[] = [];
  private activeOverlays: AvailableOverlays[] = [];
  private selectedOverlayEvent: google.maps.drawing.OverlayCompleteEvent | null = null;
  private mapId = Math.random()
    .toString(36)
    .substring(7);

  private polyOptions = {
    strokeWeight: 2,
    strokeColor: "#757575",
    fillColor: "#9E9E9E",
    fillOpacity: 0.45,
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
  }

  @Watch("selectedMarkerIndices")
  private selectedMarkerIndicesUpdated(
    newVals: Set<number>,
    oldVals: Set<number>
  ) {
    oldVals.forEach(index => {
      if (!newVals.has(index) && this.markers[index]) {
        this.markers[index].setIcon({
          url: require("@/assets/markers/point.png"),
          scaledSize: new google.maps.Size(16, 16)
        });
      }
    });
    newVals.forEach(index => {
      if (!oldVals.has(index) && this.markers[index]) {
        this.markers[index].setIcon({
          url: require("@/assets/markers/selected-point.png"),
          scaledSize: new google.maps.Size(16, 16)
        });
      }
    });
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

  @Watch("googleMarkers")
  private initMarkers(): void {
    this.clearMarkers();
    const drawnMarkers: google.maps.Marker[] = [];
    this.rowData.forEach((row, index) => {
      if (!row.lat || !row.lng) {
        drawnMarkers.push(new google.maps.Marker())
        return;
      }
      const position = { lat: row.lat!, lng: row.lng! };
      const newMarker = this.createMarker(position, row.isSelected);
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

  private createMarker(
    position: { lat: number; lng: number },
    isSelected: boolean
  ) {
    return new google.maps.Marker({
      position,
      zIndex: 1,
      map: this.map,
      icon: {
        url: isSelected
          ? require("@/assets/markers/selected-point.png")
          : require("@/assets/markers/point.png"),
        scaledSize: new google.maps.Size(16, 16)
      }
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

  private injectGoogleMapsLibrary() {
    let loader: Promise<any>;
    if (typeof google !== "object" || typeof google.maps !== "object") {
      loader = new Loader(process.env.VUE_APP_GOOGLEMAPS_KEY, {
        libraries: this.allowDraw ? ["drawing"] : []
      }).load();
    } else {
      loader = new Promise((resolve, reject) => {
        resolve(google);
      });
    }
    return loader;
  }

  private mounted(): void {
    this.injectGoogleMapsLibrary().then(google => {
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
        styles: [
          {
            featureType: "administrative.neighborhood",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.text",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "poi.business",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road.local",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "transit",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "labels.text",
            stylers: [
              {
                visibility: "off"
              }
            ]
          }
        ]
      });
      this.initMarkers();
      if (this.allowDraw) {
        this.initDrawingManager();
        this.initDrawListeners();
        this.initOverlayEvents();
      }
    });
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
.delete-button {
  position: absolute;
  margin: 5px;
  z-index: 10;
  top: -1px;
  left: 140px;
}
.summary {
  position: absolute;
  margin: 5px;
  z-index: 10;
  top: -1px;
  right: 0px;
  font-size: 14px;
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
        margin: 5px;
      }
    }
  }
}
</style>
