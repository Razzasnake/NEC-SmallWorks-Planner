<template>
  <div class="layer" @click="onClick">View</div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ICellRendererParams } from "@ag-grid-community/core";
import AgLayerModal from "./AgLayerModal.vue";

@Component({
  components: {}
})
export default class AgLayer extends Vue {
  private params!: ICellRendererParams;
  private visible: boolean = false;

  private onClick() {
    this.params.api.refreshCells();
    if (this.params.value) {
      this.$buefy.modal.open({
        parent: this,
        component: AgLayerModal,
        hasModalCard: true,
        trapFocus: true,
        props: {
          headerName: this.params.colDef.headerName,
          features: this.params.value
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.layer {
  color: blue;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>