<template>
  <Option
    name="Table"
    :dropdowns="dropdowns"
    :options="tableOptions"
    @updateOptions="updateOptions"
  ></Option>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Option from "../Option/Option.vue";

/**
 * The table specific options
 */
@Component({
  components: {
    Option
  }
})
export default class TableOption extends Vue {
  /**
   * Table options to use
   */
  @Prop({
    default: [
      "table:footer:min",
      "table:footer:max",
      "table:footer:avg",
      "table:footer:total"
    ]
  })
  private tableOptions!: string[];

  private dropdowns = [
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

  private updateOptions(options: string[]) {
    /**
     * Update parent with new array of table options
     *
     * @type {string[]}
     */
    this.$emit("updateTableOptions", options);
  }
}
</script>