<template>
  <b-dropdown>
    <span slot="trigger">Table</span>
    <b-dropdown-item @click="toggleTable">
      Table
      <font-awesome-icon :icon="tableIcon" class="displaying-icon" />
    </b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * The table specific options
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
      this.$emit("updateTableOptions", []);
    } else {
      this.$emit("updateTableOptions", ["table"]);
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