<template>
  <div id="map"></div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { Loader } from "google-maps";
import UploadedFile from "@/entities/UploadedFile";

/**
 * Display each of the uploaded rows on a map.
 */
@Component({
  components: {}
})
export default class Map extends Vue {
  /**
   * Uploaded file to be displayed on the map
   */
  @Prop()
  private uploadedFile!: UploadedFile;
  private drawnMarkers: google.maps.Marker[] = [];
  private map: google.maps.Map | null = null;

  private mounted() {
    const loader = new Loader(process.env.GOOGLEMAPS_KEY);
    loader.load().then(google => {
      const el = document.getElementById("map");
      if (el) {
        this.map = new google.maps.Map(el, {
          center: { lat: 37.0902, lng: -95.7129 },
          zoom: 5,
          disableDefaultUI: true,
          clickableIcons: false,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit.station",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });
        this.loadMarkers();
      }
    });
  }

  private loadMarkers() {
    const latCol = this.uploadedFile.columnSelections.lat;
    const lngCol = this.uploadedFile.columnSelections.lng;
    this.uploadedFile.data.forEach((row, index) => {
      if (row[latCol] && row[lngCol] && this.map) {
        const position: { lat: number; lng: number } = {
          lat: row[latCol],
          lng: row[lngCol]
        };
        const newMarker = new google.maps.Marker({
          position,
          zIndex: 1,
          map: this.map,
          icon: require("@/assets/markers/point.png")
        });
        newMarker.addListener("click", () => {
          if (this.map) {
            this.map.panTo(position);
            this.$emit("markerClicked");
          }
        });
        this.drawnMarkers.push(newMarker);
      }
    });
  }

  private beforeDestroy(): void {
    this.drawnMarkers.forEach(marker => {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    this.drawnMarkers = [];
  }
}
</script>
<style lang='scss' scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
