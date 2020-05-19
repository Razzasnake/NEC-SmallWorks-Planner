<template>
  <b-dropdown>
    <a slot="trigger" slot-scope="{ active }">
      <span>Table&nbsp;</span>
      <font-awesome-icon :icon="active ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </a>
    <b-dropdown-item
      v-for="o in options"
      :key="o.key"
      @click="toggle(o.key)"
    >{{ keyVisible(o.key) ? `Hide ${o.label}` :`Show ${o.label}` }}</b-dropdown-item>
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

  private options = [
    {
      label: "Table",
      key: "table"
    },
    {
      label: "Footer Min",
      key: "table:footer:min"
    },
    {
      label: "Footer Max",
      key: "table:footer:max"
    },
    {
      label: "Footer Avg",
      key: "table:footer:avg"
    },
    {
      label: "Footer Total",
      key: "table:footer:total"
    }
  ];

  private keyVisible(key: string) {
    return this.tableOptions.indexOf(key) > -1;
  }

  private toggle(key: string) {
    if (this.keyVisible(key)) {
      /**
       * Update parent with new array of table options
       *
       * @type {string[]}
       */
      this.$emit(
        "updateTableOptions",
        this.tableOptions.filter(_ => _ !== key)
      );
    } else {
      const viewOptions = this.tableOptions.concat(key);
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