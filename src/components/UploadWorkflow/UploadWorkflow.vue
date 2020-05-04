<template>
  <div>
    <Upload @fileUploaded="fileUploaded"></Upload>
    <b-modal
      :active="step > 0"
      :on-cancel="reset"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Select Columns</p>
        </header>
        <div class="card-content">
          <div class="content">
            <SelectColumns
              v-if="step === 1"
              :value="uploadedFile"
              :columnSelections="columnSelections"
              :firstRowHeader="firstRowHeader"
              @updateSelections="updateSelections"
              @updateFirstRowHeader="updateFirstRowHeader"
            ></SelectColumns>
          </div>
        </div>
        <div class="upload-footer">
          <b-button @click="reset" class="margin-right">Back</b-button>
          <b-button class="is-primary" @click="finish" :disabled="finishIsDisabled">Finish</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Upload from "./Upload/Upload.vue";
import SelectColumns from "./SelectColumns/SelectColumns.vue";
import UploadedFile from "@/entities/UploadedFile";
import UploadWorkflowLogic from "./UploadWorkflowLogic";

/**
 * Add all of the parts of the workflow together
 */
@Component({
  components: {
    Upload,
    SelectColumns
  }
})
export default class UploadWorkflow extends Vue {
  /**
   * (Optional) Pass in a already parsed file to let them adjust the selections.
   */
  @Prop({ default: null })
  private passedUploadedFile!: UploadedFile | null;

  private step: number = 0;
  private uploadedFile: any[][] = [];
  private columnSelections: { lat: null | number; lng: null | number } = {
    lat: null,
    lng: null
  };
  private firstRowHeader: boolean = true;

  private get finishIsDisabled() {
    return (
      this.columnSelections.lat === null || this.columnSelections.lng === null
    );
  }

  private created() {
    if (this.passedUploadedFile) {
      this.uploadedFile = this.passedUploadedFile.rawData;
      this.columnSelections = this.passedUploadedFile.columnSelections;
      this.firstRowHeader = this.passedUploadedFile.firstRowHeader;
      this.next();
    }
  }

  private fileUploaded(data: any[][]) {
    this.uploadedFile = data;
    this.columnSelections = UploadWorkflowLogic.guessColumnTypes(data);
    this.firstRowHeader = UploadWorkflowLogic.guessFirstRowHeader(data);
    if (
      this.columnSelections.lat !== null &&
      this.columnSelections.lng !== null
    ) {
      this.finish();
    } else {
      this.next();
    }
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
    /**
     * Emit the uploaded file
     * 
     * @type {UploadedFile}
     */
    this.$emit("finish", uploadedFile);
    this.reset();
  }

  private reset() {
    this.step = 0;
    this.uploadedFile = [];
    this.columnSelections = {
      lat: null,
      lng: null
    };
    this.firstRowHeader = true;
    /**
     * The modal was closed
     */
    this.$emit('closeModal')
  }
}
</script>
<style lang='scss' scoped>
.content {
  height: 300px;
  width: 50%;
  min-width: 750px;
}
.card__footer {
  margin: 10px;
}
.upload-footer {
  padding: 1.5rem;
  text-align: right;
  .margin-right {
    margin-right: 10px;
  }
}
</style>