<template>
  <div>
    <Upload @fileUploaded="fileUploaded"></Upload>
    <div class="modal is-active" v-if="step > 0">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Select Columns</p>
          <button class="delete" @click="reset"></button>
        </header>
        <section class="modal-card-body">
          <SelectColumns
            v-if="step === 1"
            :value="uploadedFile"
            :columnSelections="columnSelections"
            :firstRowHeader="firstRowHeader"
            @updateSelections="updateSelections"
            @updateFirstRowHeader="updateFirstRowHeader"
            @updateIsComplete="updateIsComplete"
          ></SelectColumns>
        </section>
        <footer class="modal-card-foot">
          <div class="field is-grouped">
            <div class="control">
              <b-button @click="reset">Back</b-button>
            </div>
            <div class="control">
              <b-button class="is-primary" @click="finish" :disabled="finishIsDisabled">Finish</b-button>
            </div>
          </div>
        </footer>
      </div>
    </div>
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
  private step: number = 0;
  private uploadedFile: any[][] = [];
  private columnSelections: {
    lat: null | number;
    lng: null | number;
    address: null | number;
    city: null | number;
    state: null | number;
    zip: null | number;
  } = {
    lat: null,
    lng: null,
    address: null,
    city: null,
    state: null,
    zip: null
  };
  private firstRowHeader: boolean = true;
  private finishIsDisabled: boolean = true;

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
    address: null | number;
    city: null | number;
    state: null | number;
    zip: null | number;
  }) {
    this.columnSelections = selections;
  }

  private updateIsComplete(complete: boolean) {
    this.finishIsDisabled = !complete;
  }

  private next() {
    this.step = this.step + 1;
  }

  private finish() {
    console.log(this.columnSelections)
    // const uploadedFile = new UploadedFile({
    //   data: this.uploadedFile,
    //   columnSelections: {
    //     lat: this.columnSelections.lat!,
    //     lng: this.columnSelections.lng!
    //   },
    //   firstRowHeader: this.firstRowHeader
    // });
    // /**
    //  * Emit the uploaded file
    //  *
    //  * @type {UploadedFile}
    //  */
    // this.$emit("finish", uploadedFile);
    this.reset();
  }

  private reset() {
    this.step = 0;
    this.uploadedFile = [];
    this.columnSelections = {
      lat: null,
      lng: null,
      address: null,
      city: null,
      state: null,
      zip: null
    };
    this.firstRowHeader = true;
    /**
     * The modal was closed
     */
    this.$emit("closeModal");
  }
}
</script>
<style lang='scss' scoped>
</style>