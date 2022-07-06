import UploadedFile, { Row } from "@/entities/UploadedFile";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import Theme from "./Theme";
import Utils from "./Utils";
import colors from "vuetify/lib/util/colors";
import Vue from "vue";

type AvailableOverlays =
  | google.maps.Polygon
  | google.maps.Rectangle
  | google.maps.Circle;

class GroupByVariables {
  public visibleCategories: Set<string> = new Set();
  public colorPosition: { [key: string]: number } | null = null;
}

export default class GoogleMapLogic {

  public mapId = Math.random()
    .toString(36)
    .substring(7);
  public activeDrawingMode: number | null = null;
  public iconColor: string = "#000000DE";
  public materialColors = [
    { fileName: "red", hash: colors.red.darken1 },
    { fileName: "blue", hash: colors.blue.darken1 },
    { fileName: "yellow", hash: colors.yellow.darken1 },
    { fileName: "green", hash: colors.green.darken1 },
    { fileName: "purple", hash: colors.purple.darken1 },
    { fileName: "orange", hash: colors.orange.darken1 },
    { fileName: "pink", hash: colors.pink.darken1 },
    { fileName: "brown", hash: colors.brown.darken1 },
    { fileName: "grey", hash: colors.grey.darken1 },
    { fileName: "indigo", hash: colors.indigo.darken1 },
    { fileName: "amber", hash: colors.amber.darken1 },
    { fileName: "cyan", hash: colors.cyan.darken1 },
    { fileName: "teal", hash: colors.teal.darken1 },
    { fileName: "lightBlue", hash: colors.lightBlue.darken1 },
    { fileName: "lightGreen", hash: colors.lightGreen.darken1 },
    { fileName: "deepPurple", hash: colors.deepPurple.darken1 },
    { fileName: "deepOrange", hash: colors.deepOrange.darken1 },
    { fileName: "lime", hash: colors.lime.darken1 },
    { fileName: "blueGrey", hash: colors.blueGrey.darken1 },
  ];
  public groupByVariables = Vue.observable(new GroupByVariables());

  private vueComponent!: Vue;
  private map!: google.maps.Map;

  private drawingManager: google.maps.drawing.DrawingManager | null = null;
  private markerCluster: MarkerClusterer | null = null;
  private heatmap: google.maps.visualization.HeatmapLayer | null = null;
  private activeOverlays: AvailableOverlays[] = [];
  private selectedOverlayEvent: { obj: google.maps.drawing.OverlayCompleteEvent | null } = Vue.observable({ obj: null });
  private markers: google.maps.Marker[] = [];
  private clickedInfoWindow: google.maps.InfoWindow | null = null;
  private activeLayerIds: Set<string> = new Set();

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

  private get groupByKey(): number | null {
    return (this.vueComponent as any).groupByKey;
  }

  private get layers(): { id: string, fileName: string, data: object | null }[] {
    return (this.vueComponent as any).layers;
  }

  constructor(vueComponent: Vue) {
    this.vueComponent = vueComponent;
  }

  public createMap() {
    Utils.injectGoogleMapsLibrary().then(() => {
      const mapEl = document.getElementById(this.mapId);
      if (mapEl) {
        this.map = new google.maps.Map(mapEl, {
          center: new google.maps.LatLng(39.8283, -98.5795),
          zoom: 5,
          disableDefaultUI: true,
          clickableIcons: false,
          zoomControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          controlSize: 32,
          gestureHandling: "greedy",
          styles: Theme
        });
        this.addIdleListener();
        this.initMarkers();
        this.initMyLocationButton();
      }
    });
  }

  private addIdleListener() {
    google.maps.event.addListener(this.map, "idle", () => {
      this.map.setOptions({ maxZoom: undefined });
      const visibleCategories: Set<string> = new Set();
      this.markers.forEach((marker, index) => {
        if (this.hiddenMarkerIndices.has(index)) {
          return;
        }
        const newValue = this.map.getBounds()!.contains(marker.getPosition()!);
        if (marker.getVisible() !== newValue) {
          marker.setVisible(newValue);
        }
        if (newValue && this.groupByKey !== null) {
          const category = (marker as unknown as { row: Row }).row.data[this.groupByKey];
          if (category) {
            visibleCategories.add(category.toString());
          }
        }
      });
      this.groupByVariables.visibleCategories = visibleCategories;
    });
  }

  private initMyLocationButton() {
    const controlDiv = document.createElement('div');

    const firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    const secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0 0';
    secondChild.style.backgroundRepeat = 'no-repeat';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(this.map, 'center_changed', () => {
      secondChild.style.backgroundPosition = '0 0';
    });

    firstChild.addEventListener('click', () => {
      let imgX = 0;
      const animationInterval = setInterval(() => {
        imgX = -imgX - 18;
        secondChild.style.backgroundPosition = imgX + 'px 0';
      }, 500);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latlng
          });
          this.map.setCenter(latlng);
          clearInterval(animationInterval);
          secondChild.style.backgroundPosition = '-144px 0';
        });
      } else {
        clearInterval(animationInterval);
        secondChild.style.backgroundPosition = '0 0';
      }
    });
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  }

  public initMarkers(): void {
    this.createMarkers();
    this.updateBounds();
    this.displayClustersChanged();
    this.displayHeatmapChanged();
    this.initDrawingManager();
    this.initDrawListeners();
    this.initOverlayEvents();
  }

  private createMarkers(): void {
    this.clearMarkers();
    const drawnMarkers: google.maps.Marker[] = [];
    const colorPosition: { [key: string]: number } = {};
    let colorPositionIndex: number = 0;
    this.uploadedFile.data
      .slice(this.uploadedFile.firstRowHeader ? 1 : 0)
      .forEach((row, index) => {
        if (row.lat === null || row.lng === null) {
          drawnMarkers.push(new google.maps.Marker());
          return;
        }
        const position = { lat: row.lat!, lng: row.lng! };
        if (this.groupByKey !== null && colorPosition[row.data[this.groupByKey]] === undefined) {
          colorPosition[row.data[this.groupByKey]] = colorPositionIndex;
          colorPositionIndex = (colorPositionIndex + 1) % this.materialColors.length;
        }
        const fileName = this.groupByKey !== null ? this.materialColors[colorPosition[row.data[this.groupByKey]]].fileName : "primary";
        const newMarker = this.createMarker(position, fileName);
        (newMarker as unknown as { row: Row }).row = row;
        newMarker.addListener("click", () => {
          if (this.map) {
            this.map.panTo(position);
            /**
             * Notify the parent of the marker that has been clicked
             *
             * @type { id: string, validate: boolean }
             */
            this.vueComponent.$emit("marker-selected", { id: row.id, validate: true });
          }
        });
        this.addInfoWindow(newMarker, row);
        if (this.hiddenMarkerIndices.has(index)) {
          newMarker.setOptions({ opacity: 0.5 });
        }
        drawnMarkers.push(newMarker);
      });
    if (Object.keys(colorPosition).length) {
      this.groupByVariables.colorPosition = colorPosition;
    } else {
      this.groupByVariables.colorPosition = null;
    }
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

  private createMarker(position: { lat: number; lng: number }, fileName: string) {
    return new google.maps.Marker({
      position,
      zIndex: 1,
      map: this.displayClusters ? undefined : this.map,
      icon: require(`@/assets/markers/${fileName}.png`)
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
    let markers = this.markers.filter((_, index) => !this.hiddenMarkerIndices.has(index));
    if (markers.length === 0) {
      markers = this.markers;
    }
    markers.forEach(marker => {
      const pos = marker.getPosition();
      if (pos && pos.lat() && pos.lng()) {
        bounds.extend(pos);
      }
    });
    this.map.setOptions({ maxZoom: 15 });
    this.map.fitBounds(bounds);
  }

  public displayClustersChanged() {
    if (!this.displayClusters && this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster = null;
    }
    if (this.groupByKey !== null) {
      const visibleCategories: Set<string> = new Set();
      this.markers.filter(_ => _.getVisible()).forEach(marker => {
        const category = (marker as unknown as { row: Row }).row.data[this.groupByKey!];
        if (category) {
          visibleCategories.add(category.toString());
        }
      });
      this.groupByVariables.visibleCategories = visibleCategories;
    }
    if (this.markerCluster) {
      this.markerCluster.repaint();
    } else if (this.displayClusters) {
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
      this.markerCluster = new MarkerClusterer(
        this.map,
        this.markers,
        {
          maxZoom: 12,
          clusterClass: "custom-clustericon",
          calculator: this.groupByKey !== null ? (...args) => this.computeClusterCalculator(...args) : undefined,
          styles: [
            {
              width: this.groupByKey !== null ? 50 : 30,
              height: this.groupByKey !== null ? 50 : 30,
              className: this.groupByKey !== null ? undefined : "custom-clustericon-1"
            },
            {
              width: this.groupByKey !== null ? 60 : 40,
              height: this.groupByKey !== null ? 60 : 40,
              className: this.groupByKey !== null ? undefined : "custom-clustericon-2"
            },
            {
              width: this.groupByKey !== null ? 70 : 50,
              height: this.groupByKey !== null ? 70 : 50,
              className: this.groupByKey !== null ? undefined : "custom-clustericon-3"
            }
          ],
          ignoreHidden: true
        }
      );
    } else {
      this.displayMarkersChanged();
    }
  }

  private computeClusterCalculator(markers: google.maps.Marker[], numStyles: number) {
    let index = 0;
    const count: number = markers.length;
    let dv = count;
    while (dv !== 0) {
      dv = Math.floor(dv / 10);
      index++;
    }
    return {
      text: this.createSvgPieChart(markers),
      index: Math.min(index, numStyles),
      title: ""
    };
  }

  private createSvgPieChart(markers: google.maps.Marker[]) {
    const data: { [key: string]: number } = {};
    markers.forEach(marker => {
      const value = (marker as unknown as { row: Row }).row.data[this.groupByKey!];
      if (data[value] === undefined) {
        data[value] = 0;
      }
      data[value] = data[value] + 1;
    });
    let cumulativePercent = 0;
    const getCoordinatesForPercent = (percent: number) => {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    }
    const svgEl = document.createElement("svg");
    svgEl.setAttribute("viewBox", "-1 -1 2 2");
    const slices = Object.keys(data).map(key => {
      const hash = this.materialColors[this.groupByVariables.colorPosition![key]].hash;
      return { total: data[key], percent: data[key] / markers.length, color: hash };
    });
    slices.forEach(slice => {
      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      cumulativePercent += slice.percent;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
      const largeArcFlag = slice.percent > .5 ? 1 : 0;
      const thickness = 0; /* You can use this to make a donut pie chart. */
      const pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `L ${endX * thickness} ${endY * thickness}`,
        `A ${thickness} ${thickness} 0 ${largeArcFlag} 0 ${startX * thickness} ${startY * thickness}`,
      ].join(" ");
      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", pathData);
      pathEl.setAttribute("fill", slice.color);
      svgEl.appendChild(pathEl);
    });
    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textEl.textContent = markers.length.toString();
    textEl.setAttribute("font-size", "0.035em");
    textEl.setAttribute("fill", "white");
    textEl.setAttribute("dominant-baseline", "middle");
    textEl.setAttribute("text-anchor", "middle");
    svgEl.appendChild(textEl);
    return svgEl.outerHTML;
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
    const data = this.markers
      .filter((_, index) => {
        const position = _.getPosition();
        return !this.hiddenMarkerIndices.has(index) && position && position.lat() && position.lng();
      })
      .map(_ => {
        return { location: _.getPosition(), weight: 1 };
      }) as google.maps.visualization.WeightedLocation[];
    this.heatmap = new google.maps.visualization.HeatmapLayer({ data });
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
      () => this.clearSelection()
    );
    google.maps.event.addListener(this.map, "click", () => this.clearSelection());
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
      this.selectedOverlayEvent.obj = newEvent;
    });
    if (newEvent.type === google.maps.drawing.OverlayType.POLYGON) {
      this.setPolygonListeners(newOverlay as google.maps.Polygon);
    } else if (newEvent.type === google.maps.drawing.OverlayType.RECTANGLE) {
      this.setRectangleListeners(newOverlay as google.maps.Rectangle);
    } else if (newEvent.type === google.maps.drawing.OverlayType.CIRCLE) {
      this.setCircleListeners(newOverlay as google.maps.Circle);
    }
    this.selectedOverlayEvent.obj = newEvent;
    if (emit) {
      /**
       * Notify the parent of all of the polygons currently being displayed on the map
       *
       * @type {google.maps.drawing.OverlayCompleteEvent[]}
       */
      this.vueComponent.$emit(
        "update-overlay-events",
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
          this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
        );
      });
      this.vueComponent.$emit("update-overlay-events", this.overlayEvents);
    });
    newOverlay.getPaths().forEach(path => {
      google.maps.event.addListener(path, "insert_at", () =>
        this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
      );
      google.maps.event.addListener(path, "set_at", () =>
        this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
      );
      google.maps.event.addListener(path, "remove_at", () =>
        this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
      );
    });
  }

  private setRectangleListeners(newOverlay: google.maps.Rectangle): void {
    newOverlay.addListener("dragstart", () => {
      google.maps.event.clearListeners(newOverlay, "bounds_changed");
    });
    newOverlay.addListener("dragend", () => {
      newOverlay.addListener("bounds_changed", () =>
        this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
      );
      this.vueComponent.$emit("update-overlay-events", this.overlayEvents);
    });
    newOverlay.addListener("bounds_changed", () =>
      this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
    );
  }

  private setCircleListeners(newOverlay: google.maps.Circle): void {
    newOverlay.addListener("dragstart", () => {
      google.maps.event.clearListeners(newOverlay, "center_changed");
    });
    newOverlay.addListener("dragend", () => {
      newOverlay.addListener("center_changed", () =>
        this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
      );
      this.vueComponent.$emit("update-overlay-events", this.overlayEvents);
    });
    newOverlay.addListener("center_changed", () =>
      this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
    );
    newOverlay.addListener("radius_changed", () =>
      this.vueComponent.$emit("update-overlay-events", this.overlayEvents)
    );
  }

  public clearSelection(): void {
    if (this.selectedOverlayEvent.obj) {
      const overlay = this.selectedOverlayEvent.obj.overlay as AvailableOverlays;
      overlay.setEditable(false);
      overlay.setDraggable(false);
      this.selectedOverlayEvent.obj = null;
    }
  }

  public deleteSelectedOverlay(): void {
    if (this.selectedOverlayEvent.obj) {
      const overlayIndex = this.overlayEvents.findIndex(
        _ => _.overlay === this.selectedOverlayEvent.obj!.overlay
      );
      if (overlayIndex >= 0) {
        const newOverlayEvents = this.overlayEvents
          .slice(0, overlayIndex)
          .concat(this.overlayEvents.slice(overlayIndex + 1));
        this.vueComponent.$emit("update-overlay-events", newOverlayEvents);
        this.selectedOverlayEvent.obj.overlay!.setMap(null);
        this.selectedOverlayEvent.obj = null;
      }
    }
  }

  public deleteAllOverlays(): void {
    this.vueComponent.$emit("update-overlay-events", []);
    this.overlayEvents.forEach(overlayEvent => {
      overlayEvent.overlay!.setMap(null);
    });
  }

  public initOverlayEvents(): void {
    this.clearOverlays();
    this.overlayEvents.forEach(event => {
      event.overlay!.setOptions(this.polyOptions);
      event.overlay!.setMap(this.map);
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

  public updateMarkerImages() {
    const colorPosition: { [key: string]: number } = {};
    let colorPositionIndex: number = 0;
    this.markers.forEach(row => {
      const data = (row as unknown as { row: { data: any[] } }).row.data;
      if (this.groupByKey !== null && colorPosition[data[this.groupByKey]] === undefined) {
        colorPosition[data[this.groupByKey]] = colorPositionIndex;
        colorPositionIndex = (colorPositionIndex + 1) % this.materialColors.length;
      }
      const fileName = this.groupByKey !== null ? this.materialColors[colorPosition[data[this.groupByKey]]].fileName : "primary";
      row.setIcon(require(`@/assets/markers/${fileName}.png`));
    });
    if (Object.keys(colorPosition).length) {
      this.groupByVariables.colorPosition = colorPosition;
    } else {
      this.groupByVariables.colorPosition = null;
    }
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster = null;
    }
    this.displayClustersChanged();
  }

  public hiddenMarkerIndicesUpdated(
    newVals: Set<number>,
    oldVals: Set<number>
  ) {
    oldVals.forEach(index => {
      if (!newVals.has(index) && this.markers[index]) {
        this.markers[index].setOptions({ opacity: 1 });
      }
    });
    newVals.forEach(index => {
      if (!oldVals.has(index) && this.markers[index]) {
        this.markers[index].setOptions({ opacity: 0.5 });
      }
    });
    if ((newVals.size || oldVals.size) && this.markers.length) {
      this.displayHeatmapChanged();
      this.displayClustersChanged();
    }
  }

  public updateLayers() {
    const doneLayers = this.layers.filter(_ => _.data !== null);
    const currentIds = new Set(doneLayers.flatMap((layer: any) => layer.data.features).map((feature: any) => feature.properties.Table_Map_Id));
    this.map.data.forEach(layer => {
      const layerId = layer.getId()!.toString();
      if (!currentIds.has(layerId)) {
        this.map.data.remove(layer);
      }
    });
    doneLayers.forEach(layer => {
      if (!this.activeLayerIds.has(layer.id)) {
        this.map.data.addGeoJson(layer.data!, {
          idPropertyName: "Table_Map_Id"
        });
      }
    });
    this.activeLayerIds = new Set(doneLayers.map(layer => layer.id));
    this.map.data.setStyle({
      strokeWeight: 2,
      strokeColor: "#1E88E5",
      fillColor: "#1E88E5"
    });
  }

  public beforeDestroy() {
    this.clearMarkers();
    this.clearOverlays();
  }
}