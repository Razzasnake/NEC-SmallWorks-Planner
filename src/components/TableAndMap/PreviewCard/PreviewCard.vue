<template>
  <div class="card">
    <header class="card-header">
      <b-button class="width-50" v-if="!clickedMarker.isSelected" @click="select">Select</b-button>
      <b-button class="width-50" v-else @click="deselect">Deselect</b-button>
      <b-button class="width-50" @click="close">Close</b-button>
    </header>
    <b-table striped narrowed hoverable :data="tableData" :columns="tableColumns"></b-table>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadedFile, { Row } from "@/entities/UploadedFile";

/**
 * Display a preview of the marker/row that has been clicked.
 */
@Component({
  components: {}
})
export default class PreviewCard extends Vue {
  /**
   * The row that was clicked
   */
  @Prop()
  private clickedMarker!: Row;
  /**
   * The entire file that was uploaded
   */
  @Prop({ default: null })
  private uploadedFile!: UploadedFile;

  private get tableData() {
    let values: { label: any; value: any }[] = [];
    if (this.uploadedFile.firstRowHeader) {
      this.uploadedFile.data[0].data.forEach((key, index) => {
        values.push({ label: key, value: this.clickedMarker.data[index] });
      });
    } else {
      this.uploadedFile.data[0].data.forEach((_, index) => {
        const key = `Column ${index.toString()}`;
        values.push({ label: key, value: this.clickedMarker.data[index] });
      });
    }
    return values;
  }

  private get tableColumns() {
    return [
      {
        field: "label",
        label: "Label"
      },
      {
        field: "value",
        label: "Value"
      }
    ];
  }

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
.width-50 {
  width: 50%;
}
</style>
