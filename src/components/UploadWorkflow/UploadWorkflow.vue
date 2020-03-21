<template>
  <div>
    <Upload @fileUploaded="fileUploaded"></Upload>
    <b-modal :active="step > 0" :on-cancel="reset" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{{ title }}</p>
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
            <Upsell v-if="step === 2"></Upsell>
          </div>
        </div>
        <footer class="card-footer">
          <span class="card-footer-item" @click="back">Back</span>
          <span v-if="step < 2" class="card-footer-item" @click="next">Next</span>
          <span v-else class="card-footer-item" @click="finish">Finish</span>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Upload from "./Upload/Upload.vue";
import SelectColumns from "./SelectColumns/SelectColumns.vue";
import Upsell from "./Upsell/Upsell.vue";
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

  private get title() {
    if (this.step === 1) {
      return "Select Columns";
    } else if (this.step === 2) {
      return "Upsell";
    } else {
      return "";
    }
  }

  private get nextIsDisabled() {
    return (
      this.columnSelections.lat === null || this.columnSelections.lng === null
    );
  }

  private fileUploaded(data: any[][]) {
    this.uploadedFile = data;
    this.columnSelections = UploadWorkflowLogic.guessColumnTypes(data);
    this.firstRowHeader = UploadWorkflowLogic.guessFirstRowHeader(data);
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
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
    this.reset();
  }

  private back() {
    this.step = this.step - 1;
    this.progress = this.progress - 50;
    if (this.step === 0) {
      this.reset();
    }
  }

  private reset() {
    this.step = 0;
    this.progress = 0;
    this.uploadedFile = [];
    this.columnSelections = {
      lat: null,
      lng: null
    };
    this.firstRowHeader = true;
  }
}
</script>
<style lang='scss' scoped>
.card-footer-item {
  color: #7957d5;
  cursor: pointer;
}
.content {
  height: 300px;
  width: 50%;
  min-width: 750px;
}
</style>