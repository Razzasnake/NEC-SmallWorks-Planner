<template>
  <div id="hiddenMap"></div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

declare const Microsoft: any;

@Component({
  components: {}
})
export default class Geocoder extends Vue {
  /**
   * Addresses to geocode
   */
  @Prop({ default: () => [] })
  private addresses!: string[];

  private mounted() {
    const map = new Microsoft.Maps.Map("#hiddenMap", {
      credentials: process.env.VUE_APP_GEOCODE_KEY
    });
    Microsoft.Maps.loadModule("Microsoft.Maps.Search", () => {
      const searchManager = new Microsoft.Maps.Search.SearchManager(map);
      this.addresses.forEach((address: string, index: number) => {
        const searchRequest = {
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
        searchManager.geocode(searchRequest);
      });
    });
  }
}
</script>
<style lang='scss' scoped>
#hiddenMap {
  height: 1px;
  width: 1px;
}
</style>