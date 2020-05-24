<template>
  <div id="hiddenMap"></div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

declare const Microsoft: any;

/**
 * Component with a height of 1 pixel and width of 1 pixel. Pass in a list of addresses and it uses the bing map to geocode them super fast.
 */
@Component({
  components: {}
})
export default class Geocoder extends Vue {
  /**
   * Addresses to geocode
   */
  @Prop({ default: () => [] })
  private addresses!: string[];

  @Watch("addresses")
  private addressesUpdated() {
    this.run();
  }

  public completed: number = 0;
  private get completedAux() {
    return this.completed;
  }
  private set completedAux(newValue: number) {
    this.completed = newValue;
    if (this.completed === this.addresses.length) {
      this.$emit("finish");
    }
  }

  private run() {
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
              this.completedAux += 1;
            } else {
              this.$emit("updateLocation", {
                index,
                latitude: null,
                longitude: null
              });
              this.completedAux += 1;
            }
          },
          errorCallback: () => {
            this.$emit("updateLocation", {
              index,
              latitude: null,
              longitude: null
            });
            this.completedAux += 1;
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