<template>
  <b-dropdown>
    <span slot="trigger">Map</span>
    <b-dropdown-item @click="toggleMap">
      Map
      <font-awesome-icon :icon="mapIcon" class="displaying-icon" />
    </b-dropdown-item>
    <b-dropdown-item @click="toggleHeatMap">
      Heat Map
      <font-awesome-icon :icon="heatMapIcon" class="displaying-icon" />
    </b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * The map specific options
 */
@Component({
  components: {}
})
export default class MapOption extends Vue {
  /**
   * Map options to use
   */
  @Prop({ default: () => ["map"] })
  private mapOptions!: string[];

  private get mapVisible() {
    return this.mapOptions.indexOf("map") > -1;
  }

  private get heatMapVisible() {
    return this.mapVisible && this.mapOptions.indexOf("map:heat") > -1;
  }

  private get mapIcon() {
    return this.mapVisible ? "eye" : "eye-slash";
  }

  private get heatMapIcon() {
    return this.heatMapVisible ? "eye" : "eye-slash";
  }

  private toggleMap() {
    if (this.mapVisible) {
      /**
       * Update parent with new array of map options
       *
       * @type {string[]}
       */
      this.$emit("updateMapOptions", []);
    } else {
      this.$emit("updateMapOptions", ["map"]);
    }
  }

  private toggleHeatMap() {
    if (this.heatMapVisible) {
      this.$emit("updateMapOptions", ["map"]);
    } else {
      this.$emit("updateMapOptions", ["map", "map:heat"]);
    }
  }
}
</script>
<style lang='scss' scoped>
.displaying-icon {
  position: absolute;
  right: 1rem;
}
</style>