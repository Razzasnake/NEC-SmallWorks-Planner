<template>
  <b-dropdown>
    <a slot="trigger" slot-scope="{ active }">
      <span>Map&nbsp;</span>
      <font-awesome-icon :icon="active ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </a>
    <b-dropdown-item @click="toggle('map')">{{ mapVisible ? "Hide Map" : "Show Map" }}</b-dropdown-item>
    <b-dropdown-item
      @click="toggle('map:heat')"
    >{{ keyVisible("map:heat") ? "Hide Heat Map" : "Show Heat Map" }}</b-dropdown-item>
    <b-dropdown-item
      @click="toggle('map:markers')"
    >{{ keyVisible("map:markers") ? "Hide Markers" : "Show Markers" }}</b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * The map specific options. Includes the ability to toggle the map itself, the markers and a heatmap.
 */
@Component({
  components: {}
})
export default class MapOption extends Vue {
  /**
   * Map options to use
   */
  @Prop({ default: () => ["map", "map:markers"] })
  private mapOptions!: string[];

  private get mapVisible() {
    return this.mapOptions.indexOf("map") > -1;
  }

  private keyVisible(key: string) {
    return this.mapVisible && this.mapOptions.indexOf(key) > -1;
  }

  private toggle(key: string) {
    if (this.keyVisible(key)) {
      /**
       * Update parent with new array of map options
       *
       * @type {string[]}
       */
      this.$emit(
        "updateMapOptions",
        this.mapOptions.filter(_ => _ !== key)
      );
    } else {
      const viewOptions = this.mapOptions.concat(key);
      if (!this.mapVisible) {
        viewOptions.push("map");
      }
      this.$emit("updateMapOptions", viewOptions);
    }
  }
}
</script>
<style lang='scss' scoped>
.displaying-icon {
  position: absolute;
  right: 18px;
  top: 10px;
}
</style>