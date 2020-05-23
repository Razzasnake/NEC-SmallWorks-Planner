<template>
  <div id="hiddenMap"></div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import geocodeApi from "@/api/geocode";

@Component({
  components: {}
})
export default class Geocoder extends Vue {
  /**
   * Addresses to geocode
   */
  @Prop({ default: () => [] })
  private addresses!: string[];
  private searchManager: Microsoft.Maps.Search.SearchManager | null = null;
  private map!: Microsoft.Maps.Map;

  private geocode(address: string, index: number) {
    if (!this.searchManager) {
      Microsoft.Maps.loadModule("Microsoft.Maps.Search", () => {
        this.searchManager = new Microsoft.Maps.Search.SearchManager(this.map);
        this.geocode(address, index);
      });
    } else {
      var searchRequest = {
        where: address,
        callback: (r: {
          results: { location: { latitude: number; longitude: number } }[];
        }) => {
          if (r && r.results && r.results.length > 0) {
            const latitude = r.results[0].location.latitude;
            const longitude = r.results[0].location.longitude;
            /**
             * Notify parent of new geocode
             *
             * @type {{index: number, latitude: number | null, longitude: number | null}}
             */
            this.$emit("updateLocation", { index, latitude, longitude });
          } else {
            this.$emit("updateLocation", {
              index,
              latitude: null,
              longitude: null
            });
          }
        },
        errorCallback: () => {
          this.$emit("updateLocation", {
            index,
            latitude: null,
            longitude: null
          });
        }
      };
      this.searchManager.geocode(searchRequest);
    }
  }

  private mounted() {
    this.map = new Microsoft.Maps.Map("#hiddenMap", {
      credentials: process.env.VUE_APP_GEOCODE_KEY
    });
    this.addresses.forEach((address: string, index: number) => {
      this.geocode(address, index);
    });
  }
}
</script>
<style lang='scss' scoped>
#hiddenMap {
  visibility: hidden;
}
</style>