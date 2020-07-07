<template>
  <div class="toolbar">
    <TableOption :tableOptions="viewOptions" @updateTableOptions="updateTableOptions"></TableOption>
    <MapOption
      class="margin-left-medium"
      :mapOptions="viewOptions"
      @updateMapOptions="updateMapOptions"
    ></MapOption>
    <ExportOption
      class="margin-left-medium"
      @updateExportOptions="$emit('updateExportOptions', $event)"
    ></ExportOption>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import MapOption from "./Options/MapOption/MapOption.vue";
import TableOption from "./Options/TableOption/TableOption.vue";
import ExportOption from "./Options/ExportOption/ExportOption.vue";

/**
 * Contain general functionality for table and map component. More explanation of what is available is in the docs for the children
 */
@Component({
  components: {
    MapOption,
    TableOption,
    ExportOption
  }
})
export default class Toolbar extends Vue {
  /**
   * Options to use
   */
  @Prop({ default: () => ["table", "table:footer:total", "table:footer:avg", "map", "map:markers"] })
  private viewOptions!: string[];

  private updateMapOptions(mapOptions: string[]) {
    if (mapOptions.indexOf("table") < 0 && mapOptions.indexOf("map") < 0) {
      mapOptions.push("table");
    }
    /**
     * Update view options
     *
     * @type {string[]}
     */
    this.$emit("updateViewOptions", mapOptions);
  }

  private updateTableOptions(tableOptions: string[]) {
    if (tableOptions.indexOf("map") < 0 && tableOptions.indexOf("table") < 0) {
      tableOptions.push("map");
    }
    this.$emit("updateViewOptions", tableOptions);
  }
}
</script>
<style lang='scss' scoped>
@import "@/sass/buefy.scss";
.toolbar {
  font-size: 14px;
  padding: 7.5px 12px;
}
</style>