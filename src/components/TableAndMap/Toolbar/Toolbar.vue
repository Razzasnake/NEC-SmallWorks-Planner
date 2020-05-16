<template>
  <div class="toolbar">
    <TableOption
      class="option"
      :tableOptions="viewOptions"
      @updateTableOptions="updateTableOptions"
    ></TableOption>
    <MapOption class="option" :mapOptions="viewOptions" @updateMapOptions="updateMapOptions"></MapOption>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import MapOption from "./Options/MapOption/MapOption.vue";
import TableOption from "./Options/TableOption/TableOption.vue";

/**
 * Contain general functionality for table and map component
 */
@Component({
  components: {
    MapOption,
    TableOption
  }
})
export default class Toolbar extends Vue {
  /**
   * Options to use
   */
  @Prop({ default: () => ["map", "table"] })
  private viewOptions!: string[];

  private updateMapOptions(mapOptions: string[]) {
    const tableOptions = this.viewOptions.filter(_ => _.startsWith("table"));
    if (tableOptions.indexOf("table") < 0 && mapOptions.indexOf("map") < 0) {
      tableOptions.push("table");
    }
    /**
     * Update view options
     */
    this.$emit("updateViewOptions", tableOptions.concat(mapOptions));
  }

  private updateTableOptions(tableOptions: string[]) {
    const mapOptions = this.viewOptions.filter(_ => _.startsWith("map"));
    if (mapOptions.indexOf("map") < 0 && tableOptions.indexOf("table") < 0) {
      mapOptions.push("map");
    }
    this.$emit("updateViewOptions", mapOptions.concat(tableOptions));
  }
}
</script>
<style lang='scss' scoped>
.toolbar {
  .option {
    margin: 4px 0px 4px 12px;
  }
}
</style>