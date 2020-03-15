<template>
  <div class="upload-workflow">
    <b-progress :value="progress" show-value type="is-primary">{{ `${this.step + 1} out of 3` }}</b-progress>
    <div class="upload-workflow__content">
      <Upload v-if="step === 0" @fileUploaded="fileUploaded"></Upload>
      <SelectColumns
        v-if="step === 1"
        :value="uploadedFile"
        :columnSelections="columnSelections"
        :firstRowHeader="firstRowHeader"
        @updateSelections="updateSelections"
        @updateFirstRowHeader="updateFirstRowHeader"
      ></SelectColumns>
      <Upsell v-if="step === 2"></Upsell>
    </div>
    <div v-if="step > 0" class="upload-workflow__footer">
      <b-button @click="back" style="margin-right: 10px;">Back</b-button>
      <b-button v-if="step < 2" type="is-primary" @click="next" :disabled="nextIsDisabled">Next</b-button>
      <b-button v-else type="is-primary" @click="finish">Finish</b-button>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Upload from "./steps/Upload/Upload.vue";
import SelectColumns from "./steps/SelectColumns/SelectColumns.vue";
import Upsell from "./steps/Upsell/Upsell.vue";
import UploadedFile from "@/entities/UploadedFile";
import UploadWorkflowLogic from "./UploadWorkflowLogic";

/**
 * Add all of the parts of the workflow together
 */
@Component({
  components: {
    Upload,
    SelectColumns,
    Upsell
  }
})
export default class UploadWorkflow extends Vue {
  private step = 0;
  private progress = 0;

  private uploadedFile: any[][] = [];
  private columnSelections: { lat: null | number; lng: null | number } = {
    lat: null,
    lng: null
  };
  private firstRowHeader: boolean = true;

  private get nextIsDisabled() {
    return (
      this.columnSelections.lat === null || this.columnSelections.lng === null
    );
  }

  private fileUploaded(data: any[][]) {
    this.uploadedFile = data;
    this.columnSelections = UploadWorkflowLogic.guessColumnTypes(data);
    this.firstRowHeader = UploadWorkflowLogic.guessFirstRowHeader(data)
    this.next();
  }

  private updateFirstRowHeader(newVal: boolean) {
    this.firstRowHeader = newVal;
  }

  private updateSelections(selections: {
    lat: null | number;
    lng: null | number;
  }) {
    this.columnSelections = selections;
  }

  private next() {
    this.step = this.step + 1;
    this.progress = this.progress + 50;
  }

  private finish() {
    const uploadedFile = new UploadedFile({
      data: this.uploadedFile,
      columnSelections: {
        lat: this.columnSelections.lat!,
        lng: this.columnSelections.lng!
      },
      firstRowHeader: this.firstRowHeader
    });
    this.$emit("finish", uploadedFile);
  }

  private back() {
    this.step = this.step - 1;
    this.progress = this.progress - 50;
  }
}
</script>
<style lang='scss' scoped>
.upload-workflow {
  position: relative;
  height: 384px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  padding: 10px;
  width: 50%;
  min-width: 750px;
  .upload-workflow__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-workflow__footer {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
</style>