<template>
  <Option
    name="Export"
    :dropdowns="dropdowns"
    @updateOptions="updateOptions"
    activeText
    inactiveText
  ></Option>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Option from "../Option/Option.vue";

/**
 * The export specific options
 */
@Component({
  components: {
    Option
  }
})
export default class ExportOption extends Vue {
  private dropdowns = [
    {
      label: "CSV",
      key: "export:csv"
    }
  ];

  private updateOptions(options: string[]) {
    /**
     * Update parent with new array of export options
     *
     * @type {string[]}
     */
    this.$emit("updateExportOptions", options);
  }
}
</script>