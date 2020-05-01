<template>
  <div style="cursor: pointer">
    <span v-if="state.isChecked" class="ag-icon ag-icon-checkbox-checked" @click="change"></span>
    <span v-else class="ag-icon ag-icon-checkbox-unchecked" @click="change"></span>
  </div>
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