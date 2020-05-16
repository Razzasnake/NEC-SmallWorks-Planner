<template>
  <b-dropdown>
    <a slot="trigger" slot-scope="{ active }">
      <span>Table&nbsp;</span>
      <font-awesome-icon :icon="active ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </a>
    <b-dropdown-item @click="toggleTable">
      Table
      <font-awesome-icon :icon="tableIcon" class="displaying-icon" />
    </b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * The table specific options. Includes only the ability to toggle the table
 */
@Component({
  components: {}
})
export default class TableOption extends Vue {
  /**
   * Table options to use
   */
  @Prop({ default: () => ["table"] })
  private tableOptions!: string[];

  private get tableVisible() {
    return this.tableOptions.indexOf("table") > -1;
  }

  private get tableIcon() {
    return this.tableVisible ? "eye" : "eye-slash";
  }

  private toggleTable() {
    if (this.tableVisible) {
      /**
       * Update parent with new array of table options
       *
       * @type {string[]}
       */
      this.$emit(
        "updateTableOptions",
        this.tableOptions.filter(_ => _ !== "table")
      );
    } else {
      const viewOptions = this.tableOptions.concat("table");
      this.$emit("updateTableOptions", viewOptions);
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