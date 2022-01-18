<template>
  <div id="hiddenMap" />
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

declare const Microsoft: any;

/**
 * Component with a height of 1 pixel and width of 1 pixel. Pass in a list of addresses and it uses the bing map to geocode them super fast.
 */
@Component({
  name: "UploadWorkflowGeocoder",
  components: {},
})
export default class Geocoder extends Vue {
  /**
   * Addresses to geocode
   */
  @Prop({ default: Array() })
  private addresses!: string[];
  private completed: number = 0;
  private searchManager: any;
  private numWorkers: number = 1; /* Best number after time trials. Don't change. */

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
      this.completed = 0;
    }
  }

  @Watch("addresses")
  private addressesUpdated() {
    this.geocode();
  }

  private async mounted() {
    this.searchManager = await this.newSearchManager();
  }

  private newSearchManager() {
    return new Promise((resolve) => {
      const bingMapsScript = document.createElement("script");
      const windowAny = window as any;
      windowAny.OnLoadBingMapsApi = () => {
        const map = new Microsoft.Maps.Map("#hiddenMap", {
          credentials: process.env.VUE_APP_GEOCODE_KEY,
        });
        Microsoft.Maps.loadModule("Microsoft.Maps.Search", () => {
          resolve(new Microsoft.Maps.Search.SearchManager(map));
        });
      };
      bingMapsScript.setAttribute(
        "src",
        `https://www.bing.com/api/maps/mapcontrol?key=${process.env.VUE_APP_GEOCODE_KEY}&callback=OnLoadBingMapsApi`
      );
      bingMapsScript.async = true;
      bingMapsScript.defer = true;
      document.head.appendChild(bingMapsScript);
    });
  }

  private geocode() {
    const geocode = (index: number, stop: number) => {
      const searchRequest = {
        where: this.addresses[index],
        callback: async (r: {
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
            this.$emit("update-location", { index, latitude, longitude });
            this.completedAux += 1;
          } else {
            this.$emit("update-location", {
              index,
              latitude: null,
              longitude: null,
            });
            this.completedAux += 1;
          }
          if (index < stop) {
            return geocode(index + 1, stop);
          }
        },
        errorCallback: async () => {
          this.searchManager = await this.newSearchManager();
          return geocode(index, stop);
        },
      };
      this.searchManager.geocode(searchRequest);
    };

    const numPerWorker = Math.ceil(this.addresses.length / this.numWorkers);
    for (let i = 0; i < this.addresses.length; i += (numPerWorker + 1)) {
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