<template>
  <Option name="Map" :dropdowns="dropdowns" :options="mapOptions" @updateOptions="updateOptions"></Option>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Option from "../Option/Option.vue";

/**
 * The map specific options
 */
@Component({
  components: {
    Option
  }
})
export default class MapOption extends Vue {
  /**
   * Map options to use
   */
  @Prop({ default: () => ["map", "map:markers"] })
  private mapOptions!: string[];

  private dropdowns = [
    {
      label: "Map",
      key: "map"
    },
    {
      label: "Heat Map",
      key: "map:heat"
    },
    {
      label: "Markers",
      key: "map:markers"
    },
    {
      label: "Clusters",
      key: "map:clusters"
    }
  ];

  private updateOptions(options: string[]) {
    /**
     * Update parent with new array of map options
     *
     * @type {string[]}
     */
    this.$emit("updateMapOptions", options);
  }
}
</script>