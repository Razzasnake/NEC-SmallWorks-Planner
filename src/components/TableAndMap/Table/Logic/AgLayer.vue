<template>
  <div>
    <a href="#" @click="onClick" v-if="!params.node.isRowPinned()">View</a>
    <AgLayerModal
      v-if="visible"
      :headerName="params.colDef.headerName"
      :features="params.value"
      @close="onClose"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ICellRendererParams } from "@ag-grid-community/core";
import AgLayerModal from "./AgLayerModal.vue";

@Component({
  components: {
    AgLayerModal
  }
})
export default class AgLayer extends Vue {
  private params!: ICellRendererParams;
  private visible: boolean = false;

  private onClick() {
    this.params.api.refreshCells();
    if (this.params.value) {
      this.visible = true;
    }
  }

  private onClose() {
    this.visible = false;
  }
}
</script>