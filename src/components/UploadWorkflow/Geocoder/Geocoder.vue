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
  private numWorkers: number = 2; /* Best number after time trials. Don't change. */

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

  private async geocode() {
    const geocode = (index: number, stop: number, attempt: number = 0) => {
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
          if (attempt > 3) {
            this.$emit("update-location", {
              index,
              latitude: null,
              longitude: null,
            });
            this.completedAux += 1;
            if (index < stop) {
              return geocode(index + 1, stop);
            }
          } else {
            return geocode(index, stop, attempt + 1);
          }
        },
      };
      this.searchManager.geocode(searchRequest);
    };

    const chunk = 1000;
    for (let i = 0, j = this.addresses.length; i < j; i += chunk) {
      const temporary = this.addresses.slice(i, i + chunk);
      const numPerWorker = Math.ceil(temporary.length / this.numWorkers);
      const before = this.completed;
      this.searchManager = await this.newSearchManager();
      for (let k = 0; k < temporary.length; k += numPerWorker + 1) {
        if (k + numPerWorker > temporary.length - 1) {
          geocode(i + k, i + temporary.length - 1);
        } else {
          geocode(i + k, i + k + numPerWorker);
        }
      }
      while (before + temporary.length !== this.completed) {
        await new Promise((resolve) => setTimeout(resolve, 500));
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