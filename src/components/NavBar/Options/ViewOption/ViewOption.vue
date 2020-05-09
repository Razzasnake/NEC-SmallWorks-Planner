<template>
  <b-navbar-dropdown label="View">
    <b-navbar-item value="map" @click="mapClicked">
      Map
      <b-icon :icon="mapIcon" class="displaying-icon"></b-icon>
    </b-navbar-item>
    <b-navbar-item value="table" @click="tableClicked">
      Table
      <b-icon :icon="tableIcon" class="displaying-icon"></b-icon>
    </b-navbar-item>
  </b-navbar-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * The view dropdown in the toolbar
 */
@Component({
  components: {}
})
export default class ViewOption extends Vue {
  /**
   * The current view settings
   */
  @Prop({ default: () => ["map", "table"] })
  private viewOptions!: string[];

  private get mapIcon() {
    return this.viewOptionsAux.indexOf("map") > -1 ? "eye" : "eye-off";
  }

  private get tableIcon() {
    return this.viewOptionsAux.indexOf("table") > -1 ? "eye" : "eye-off";
  }

  private get viewOptionsAux(): string[] {
    return this.viewOptions;
  }
  private set viewOptionsAux(newValues: string[]) {
    /**
     * Update view options
     *
     * @type {string[]}
     */
    this.$emit("updateViewOptions", newValues);
  }

  private mapClicked() {
    if (this.viewOptionsAux.indexOf("map") > -1) {
      this.viewOptionsAux = ["table"];
    } else {
      this.viewOptionsAux = ["map", "table"];
    }
  }

  private tableClicked() {
    if (this.viewOptionsAux.indexOf("table") > -1) {
      this.viewOptionsAux = ["map"];
    } else {
      this.viewOptionsAux = ["map", "table"];
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