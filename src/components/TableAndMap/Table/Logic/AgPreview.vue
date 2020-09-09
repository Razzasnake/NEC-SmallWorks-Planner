<template>
  <div>
    <v-select v-if="footerValue" v-model="footerAggregationSelection" :items="footerAggregations"></v-select>
    <a v-else @click="onClick">
      <v-icon color="primary" small>{{ mdiEye }}</v-icon>
    </a>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ICellRendererParams } from "@ag-grid-community/core";
import { mdiEye } from "@mdi/js";
import state, { updateViewOptions } from "@/store/exploreStore";

@Component({
  components: {},
})
export default class AgGridLink extends Vue {
  private params!: ICellRendererParams;
  private mdiEye = mdiEye;
  private get footerValue() {
    return this.params.data.preview;
  }

  private footerAggregations = [
    { text: "Min", value: "table:footer:min" },
    { text: "Max", value: "table:footer:max" },
    { text: "Avg", value: "table:footer:avg" },
    { text: "Total", value: "table:footer:total" },
  ];

  private get footerAggregationSelection() {
    const value = state.viewOptions.find((_) => _.startsWith("table:footer:"));
    return value ? value : "";
  }

  private set footerAggregationSelection(newValue: string) {
    const nonFooter = state.viewOptions.filter(
      (_) => !_.startsWith("table:footer:")
    );
    updateViewOptions(nonFooter.concat(newValue));
  }

  private onClick() {
    /**
     * Open the preview card from a click in the table
     *
     * @type {string}
     */
    this.$parent.$parent.$emit("markerSelected", this.params.data.id);
  }
}
</script>
<style lang="scss" scoped>
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}
</style>