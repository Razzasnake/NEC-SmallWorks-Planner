import ShapeParserWorker from "worker-loader!./WebWorkers/ShapeParserWorker";
import PolygonRelationWorker from "worker-loader!./WebWorkers/PolygonRelationWorker";
import {
  updateFeature,
  createFeature
} from "@/store/exploreStore";
import UploadedFile, { Row } from "@/entities/UploadedFile";
import MarkerClusterer from "@google/markerclustererplus";
import Theme from "./Theme";
import Utils from "./Utils";

type AvailableOverlays =
  | google.maps.Polygon
  | google.maps.Rectangle
  | google.maps.Circle;

export default class GoogleMapLogic {

  public mapId = Math.random()
    .toString(36)
    .substring(7);
  public activeDrawingMode: number | null = null;
  public iconColor: string = "#000000DE";

  private vueComponent!: Vue;
  private map!: google.maps.Map;

  private drawingManager: google.maps.drawing.DrawingManager | null = null;
  private markerCluster: MarkerClusterer | null = null;
  private heatmap: google.maps.visualization.HeatmapLayer | null = null;
  private activeOverlays: AvailableOverlays[] = [];
  private selectedOverlayEvent: google.maps.drawing.OverlayCompleteEvent | null = null;
  private markers: google.maps.Marker[] = [];
  private clickedInfoWindow: google.maps.InfoWindow | null = null;

  private polyOptions = {
    strokeWeight: 2,
    strokeColor: "#10546A",
    fillColor: "#ECECEC",
    fillOpacity: 0.5,
    editable: true,
    draggable: false,
    zIndex: 2
  };

  private get uploadedFile(): UploadedFile {
    return (this.vueComponent as any).uploadedFile;
  }

  private get overlayEvents(): google.maps.drawing.OverlayCompleteEvent[] {
    return (this.vueComponent as any).overlayEvents;
  }

  private get createInfoWindow(): (
    marker: google.maps.Marker,
    row: Row
  ) => google.maps.InfoWindow {
    return (this.vueComponent as any).createInfoWindow;
  }

  private get allowDraw(): boolean {
    return (this.vueComponent as any).allowDraw;
  }

  private get hiddenMarkerIndices(): Set<number> {
    return (this.vueComponent as any).hiddenMarkerIndices;
  }

  private get displayHeatmap(): boolean {
    return (this.vueComponent as any).displayHeatmap;
  }

  private get displayMarkers(): boolean {
    return (this.vueComponent as any).displayMarkers;
  }

  private get displayClusters(): boolean {
    return (this.vueComponent as any).displayClusters;
  }

  private get clickedMarker(): Row | null {
    return (this.vueComponent as any).clickedMarker;
  }

  constructor(vueComponent: Vue) {
    this.vueComponent = vueComponent;
  }

  public createMap() {
    Utils.injectGoogleMapsLibrary(
      this.allowDraw ? ["drawing", "visualization"] : []
    ).then(() => {
      const mapEl = document.getElementById(this.mapId);
      if (mapEl) {
        this.map = new google.maps.Map(mapEl, {
          center: new google.maps.LatLng(39.8283, -98.5795),
          zoom: 5,
          disableDefaultUI: true,
          clickableIcons: false,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: Theme
        });
        this.addIdleListener();
        this.initMarkers();
      }
    });
  }

  private addIdleListener() {
    google.maps.event.addListener(this.map, "idle", () => {
      this.markers.forEach((marker, index) => {
        if (this.hiddenMarkerIndices.has(index)) {
          return;
        }
        const newValue = this.map.getBounds()!.contains(marker.getPosition()!);
        if (marker.getVisible() !== newValue) {
          marker.setVisible(newValue);
        }
      });
    });
  }

  public initMarkers(): void {
    this.createMarkers();
    this.updateBounds();
    this.displayClustersChanged();
    this.displayHeatmapChanged();
    if (this.allowDraw) {
      this.initDrawingManager();
      this.initDrawListeners();
      this.initOverlayEvents();
    }
  }

  private createMarkers(): void {
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
            this.vueComponent.$emit("markerSelected", row.id);
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

  public clearMarkers(): void {
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

  public displayClustersChanged() {
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

  public displayMarkersChanged() {
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

  public displayHeatmapChanged() {
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

  private initDrawingManager(): void {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControlOptions: {
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      drawingControl: false,
      rectangleOptions: this.polyOptions,
      circleOptions: this.polyOptions,
      polygonOptions: this.polyOptions,
      map: this.map
    });
  }

  public setDrawingManager(state: number) {
    if (this.drawingManager) {
      this.activeDrawingMode = state > 0 ? state : null;
      switch (state) {
        case 0:
          this.clearSelection();
          return this.drawingManager.setDrawingMode(null);
        case 1:
          return this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
        case 2:
          return this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        case 3:
          return this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
      }
    }
  }

  private initDrawListeners(): void {
    google.maps.event.addListener(
      this.drawingManager!,
      "overlaycomplete",
      (newEvent: google.maps.drawing.OverlayCompleteEvent, emit?: boolean) =>
        this.onOverlayComplete(newEvent, emit)
    );
    google.maps.event.addListener(
      this.drawingManager!,
      "drawingmode_changed",
      this.clearSelection
    );
    google.maps.event.addListener(this.map, "click", this.clearSelection);
    document.addEventListener("keydown", e => {
      if (e.keyCode === 8 || e.keyCode === 46) {
        this.deleteSelectedOverlay();
      }
    });
  }

  public onOverlayComplete(
    newEvent: google.maps.drawing.OverlayCompleteEvent,
    emit: boolean = true
  ): void {
    const newOverlay = newEvent.overlay as AvailableOverlays;
    this.drawingManager!.setDrawingMode(null);
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
      this.vueComponent.$emit(
        "updateOverlayEvents",
        this.overlayEvents.concat(newEvent)
      );
    }
    this.activeOverlays.push(newOverlay);
    this.activeDrawingMode = null;
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
          this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
        );
      });
      this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents);
    });
    newOverlay.getPaths().forEach(path => {
      google.maps.event.addListener(path, "insert_at", () =>
        this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
      );
      google.maps.event.addListener(path, "set_at", () =>
        this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
      );
      google.maps.event.addListener(path, "remove_at", () =>
        this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
      );
    });
  }

  private setRectangleListeners(newOverlay: google.maps.Rectangle): void {
    newOverlay.addListener("dragstart", () => {
      google.maps.event.clearListeners(newOverlay, "bounds_changed");
    });
    newOverlay.addListener("dragend", () => {
      newOverlay.addListener("bounds_changed", () =>
        this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
      );
      this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents);
    });
    newOverlay.addListener("bounds_changed", () =>
      this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
    );
  }

  private setCircleListeners(newOverlay: google.maps.Circle): void {
    newOverlay.addListener("dragstart", () => {
      google.maps.event.clearListeners(newOverlay, "center_changed");
    });
    newOverlay.addListener("dragend", () => {
      newOverlay.addListener("center_changed", () =>
        this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
      );
      this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents);
    });
    newOverlay.addListener("center_changed", () =>
      this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
    );
    newOverlay.addListener("radius_changed", () =>
      this.vueComponent.$emit("updateOverlayEvents", this.overlayEvents)
    );
  }

  public clearSelection(): void {
    if (this.selectedOverlayEvent) {
      const overlay = this.selectedOverlayEvent.overlay as AvailableOverlays;
      overlay.setEditable(false);
      overlay.setDraggable(false);
      this.selectedOverlayEvent = null;
    }
  }

  public deleteSelectedOverlay(): void {
    if (this.selectedOverlayEvent) {
      const overlayIndex = this.overlayEvents.findIndex(
        _ => _.overlay === this.selectedOverlayEvent!.overlay
      );
      if (overlayIndex >= 0) {
        const newOverlayEvents = this.overlayEvents
          .slice(0, overlayIndex)
          .concat(this.overlayEvents.slice(overlayIndex + 1));
        this.vueComponent.$emit("updateOverlayEvents", newOverlayEvents);
        this.selectedOverlayEvent.overlay.setMap(null);
        this.selectedOverlayEvent = null;
      }
    }
  }

  public initOverlayEvents(): void {
    this.clearOverlays();
    this.overlayEvents.forEach(event => {
      event.overlay.setOptions(this.polyOptions);
      event.overlay.setMap(this.map);
      this.onOverlayComplete(event, false);
    });
    this.clearSelection();
  }

  public clearOverlays(): void {
    this.activeOverlays.forEach(overlay => {
      google.maps.event.clearInstanceListeners(overlay);
      overlay.setMap(null);
    });
    this.activeOverlays = [];
  }

  public clickedMarkerChanged() {
    if (this.clickedInfoWindow) {
      this.clickedInfoWindow.close();
      this.clickedInfoWindow = null;
    }
    if (this.clickedMarker && this.uploadedFile) {
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

  public hiddenMarkerIndicesUpdated(
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

  public shapefilesUploaded(fileArray: File[]) {
    fileArray.forEach(file => {
      const worker = new ShapeParserWorker();
      worker.postMessage(file);
      worker.onmessage = event => {
        this.map.data.addGeoJson(event.data);
        this.map.data.setStyle({
          strokeWeight: 2,
          strokeColor: "#1E88E5",
          fillColor: "#1E88E5"
        });
        const fkWorker = new PolygonRelationWorker();
        fkWorker.postMessage({
          markers: this.uploadedFile.data.map(_ => {
            if (_.lng && _.lat) {
              return [_.lng, _.lat];
            } else {
              return [null, null];
            }
          }),
          features: event.data.features
        });
        const polygons: google.maps.Data.Feature[] = [];
        this.map.data.forEach(p => {
          polygons.push(p);
        });
        createFeature(file.name);
        const featureIndex = this.uploadedFile.data[0].features.findIndex(_ => _.name === file.name);
        fkWorker.onmessage = event => {
          const polygonIndices: number[] = event.data.polygonIndices;
          updateFeature({
            featureIndex,
            index: event.data.index,
            features: polygonIndices.map(index => polygons[index])
          });
        };
      };
    });
  }

  public beforeDestroy() {
    this.clearMarkers();
    this.clearOverlays();
  }
}