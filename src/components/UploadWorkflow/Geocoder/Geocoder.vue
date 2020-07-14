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
  private completed: number = 0;
  private searchManager: any;
  private numWorkers: number = 6; /* Max number allowed by browsers. */

  private get completedAux() {
    return this.completed;
  }

  private set completedAux(newValue: number) {
    this.completed = newValue;
    if (this.completed === this.addresses.length) {
      /**
       * All geocodes are done, notify parent that we can finish.
       */
      this.$emit("finish");
    }
  }

  @Watch("addresses")
  private addressesUpdated() {
    this.geocode();
  }

  private mounted() {
    const bingMapsScript = document.createElement("script");
    bingMapsScript.setAttribute(
      "src",
      "https://www.bing.com/api/maps/mapcontrol?q&key=***REMOVED***"
    );
    bingMapsScript.async = true;
    bingMapsScript.defer = true;
    document.head.appendChild(bingMapsScript);
  }

  private geocode() {
    if (!this.searchManager) {
      const map = new Microsoft.Maps.Map("#hiddenMap", {
        credentials: process.env.VUE_APP_GEOCODE_KEY
      });
      Microsoft.Maps.loadModule("Microsoft.Maps.Search", () => {
        this.searchManager = new Microsoft.Maps.Search.SearchManager(map);
        this.geocode();
      });
      return;
    }

    const geocode = (index: number, stop: number) => {
      const searchRequest = {
        where: this.addresses[index],
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
          if (index + 1 < stop) {
            return geocode(index + 1, stop);
          }
        },
        errorCallback: () => {
          return geocode(index, stop);
        }
      };
      this.searchManager.geocode(searchRequest);
    };

    const numPerWorker = Math.round(this.addresses.length / this.numWorkers);
    for (let i = 0; i < this.addresses.length; i += numPerWorker) {
      if (i + numPerWorker > this.addresses.length - 1) {
        geocode(i, this.addresses.length - 1);
      } else {
        geocode(i, i + numPerWorker);
      }
    }
  }
}
</script>
<style lang='scss' scoped>
#hiddenMap {
  height: 1px;
  width: 1px;
}
</style>