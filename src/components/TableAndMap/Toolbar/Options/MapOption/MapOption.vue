<template>
  <b-dropdown>
    <a slot="trigger" slot-scope="{ active }">
      <span>Map&nbsp;</span>
      <font-awesome-icon :icon="active ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </a>
    <b-dropdown-item @click="toggleMap">
      Map
      <font-awesome-icon :icon="mapIcon" class="displaying-icon" />
    </b-dropdown-item>
    <b-dropdown-item @click="toggle('map:heat')">
      Heat Map
      <font-awesome-icon :icon="keyIcon('map:heat')" class="displaying-icon" />
    </b-dropdown-item>
    <b-dropdown-item @click="toggle('map:markers')">
      Markers
      <font-awesome-icon :icon="keyIcon('map:markers')" class="displaying-icon" />
    </b-dropdown-item>
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

  private get mapIcon() {
    return this.mapVisible ? "eye" : "eye-slash";
  }

  private keyIcon(key: string) {
    return this.keyVisible(key) ? "eye" : "eye-slash";
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

  private toggle(key: string) {
    if (this.keyVisible(key)) {
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