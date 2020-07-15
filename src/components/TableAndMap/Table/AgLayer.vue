<template>
  <div class="layer">View</div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
  components: {}
})
export default class AgGridLink extends Vue {
  private params!: ICellRendererParams;

  private onClick() {
    /* TODO:  */
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