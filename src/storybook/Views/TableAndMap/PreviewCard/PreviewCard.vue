<template>
  <div class="card">
    <header class="card-header">
      <span v-if="!clickedMarker.isSelected" class="card-footer-item" @click="select">Select</span>
      <span v-else class="card-footer-item" @click="deselect">Deselect</span>
      <span class="card-footer-item" @click="close">Close</span>
    </header>
    <div class="card-content">
      <div class="content">
        {{ clickedMarker }}
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { Row } from "@/entities/UploadedFile";

/**
 * Display a preview of the marker/row that has been clicked.
 */
@Component({
  components: {}
})
export default class PreviewCard extends Vue {
  @Prop()
  private clickedMarker!: Row;

  private select(): void {
    /**
     * Tell the parent to select this marker
     *
     * @type {string}
     */
    this.$emit("select", [this.clickedMarker.id]);
  }

  private deselect(): void {
    /**
     * Tell the parent to deselect this marker
     *
     * @type {string}
     */
    this.$emit("deselect", [this.clickedMarker.id]);
  }

  private close(): void {
    /**
     * Tell the parent to close this preview
     *
     * @type {string}
     */
    this.$emit("close");
  }
}
</script>
<style lang='scss' scoped>
.card-footer-item {
  color: #7957d5;
  cursor: pointer;
}
</style>
