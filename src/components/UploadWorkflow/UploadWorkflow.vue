<template>
  <div>
    <Loading :loading="loading" :text="geocodeProgress" />
    <Upload @fileUploaded="fileUploaded" class="align-center"></Upload>
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
          <Geocoder :addresses="addresses" @updateLocation="updateLocation" @finish="finish" />
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
import Geocoder from "./Geocoder/Geocoder.vue";
import Loading from "@/components/Shared/Loading/Loading.vue";

/**
 * Add all of the parts of the workflow together
 */
@Component({
  components: {
    Upload,
    SelectColumns,
    Geocoder,
    Loading
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
  private addresses: string[] = [];
  private loading: boolean = false;
  private numberGeocoded: number = 0;

  private get geocodeProgress() {
    return `${this.numberGeocoded.toLocaleString()} / ${this.addresses.length.toLocaleString()}`;
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

  private updateLocation(payload: {
    index: number;
    latitude: number;
    longitude: number;
  }) {
    const offset = this.firstRowHeader ? 1 : 0;
    const row = this.uploadedFile[payload.index + offset];
    row[this.columnSelections.lat!] = payload.latitude;
    row[this.columnSelections.lng!] = payload.longitude;
    this.numberGeocoded = this.numberGeocoded + 1;
  }

  private finish() {
    if (
      this.columnSelections.lat === null ||
      this.columnSelections.lng === null
    ) {
      this.handleNoLatLng();
    } else {
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
  }

  private handleNoLatLng() {
    const selections = [
      this.columnSelections.address,
      this.columnSelections.city,
      this.columnSelections.state,
      this.columnSelections.zip
    ].filter(_ => _ !== null) as number[];
    this.uploadedFile.forEach((row, index) => {
      this.uploadedFile[index] = row.concat(["", ""]);
    });
    if (this.firstRowHeader) {
      this.uploadedFile[0][this.uploadedFile[0].length - 2] = "Latitude";
      this.uploadedFile[0][this.uploadedFile[0].length - 1] = "Longitude";
    }
    const offset = this.firstRowHeader ? 1 : 0;
    this.columnSelections.lat = this.uploadedFile[0].length - 2;
    this.columnSelections.lng = this.uploadedFile[0].length - 1;
    /* When addresses is updated, the geocoder is going to start. */
    this.addresses = this.uploadedFile.slice(offset).map(row => {
      return selections.map(i => row[i]).join(" ");
    });
    this.loading = true;
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
    this.addresses = [];
    this.loading = false;
    /**
     * The modal was closed
     */
    this.$emit("closeModal");
  }
}
</script>
<style lang='scss' scoped>
.loading {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}
</style>