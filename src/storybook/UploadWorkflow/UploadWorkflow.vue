<template>
  <div class="upload-workflow">
    <b-progress :value="progress" show-value type="is-primary">{{ `${this.step + 1} out of 3` }}</b-progress>
    <div class="upload-workflow__content">
      <Upload v-if="step === 0" @fileUploaded="fileUploaded"></Upload>
      <SelectColumns
        v-if="step === 1"
        :value="uploadedFile"
        :columnSelections="columnSelections"
        @updateSelections="updateSelections"
      ></SelectColumns>
      <Upsell v-if="step === 2"></Upsell>
    </div>
    <div v-if="step > 0" class="upload-workflow__footer">
      <b-button @click="back" style="margin-right: 10px;">Back</b-button>
      <b-button v-if="step < 2" type="is-primary" @click="next" :disabled="nextIsDisabled">Next</b-button>
      <b-button v-else type="is-primary" @click="finish" :disabled="finishIsDisabled">Finish</b-button>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Upload from "./Upload/Upload.vue";
import SelectColumns from "./SelectColumns/SelectColumns.vue";
import Upsell from "./Upsell/Upsell.vue";

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

  private get nextIsDisabled() {
    return (
      this.columnSelections.lat === null || this.columnSelections.lng === null
    );
  }
  private get finishIsDisabled() {
    return false;
  }

  private fileUploaded(data: any[][]) {
    this.uploadedFile = data;
    this.next();
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
    this.$emit("finish", {
      uploadedFile: this.uploadedFile,
      columnSelections: this.columnSelections
    });
  }

  private back() {
    this.step = this.step - 1;
    this.progress = this.progress - 50;
  }
}
</script>
<style lang='scss' scoped>
.upload-workflow {
  padding: 10px;
  width: 50%;
  min-width: 750px;
  .upload-workflow__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-workflow__footer {
    float: right;
  }
}
</style>