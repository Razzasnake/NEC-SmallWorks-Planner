<template>
  <div :class="classNames" @click="change"></div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ICellRendererParams } from "ag-grid-community";

/**
 * A checkbox renderer to be used in ag-grid.
 */
@Component({
  components: {}
})
export default class AgGridCheckbox extends Vue {
  private state = { isChecked: false };
  private params!: ICellRendererParams;
  private get classNames(): string {
    return `ag-input-wrapper ag-checkbox-input-wrapper ${
      this.state.isChecked ? "ag-checked" : ""
    }`;
  }
  private mounted() {
    let boolValue = this.params.value.toString() === "true";
    this.state.isChecked = boolValue;
    this.params.node.setSelected(boolValue);
  }
  private change() {
    const checked = !this.state.isChecked;
    this.state.isChecked = checked;
    this.params.setValue(checked);
    this.params.node.setSelected(checked);
  }
}
</script>