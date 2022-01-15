<template>
  <div>
    <Upload
      :color="color"
      :small="small"
      @file-uploaded="fileUploaded"
    />
    <v-dialog
      v-model="visible"
      max-width="700"
      @click:outside="reset"
    >
      <Loading
        :loading="loading"
        :value="numberGeocoded"
        :max="addresses.length"
        label="Geocoding"
      />
      <v-card>
        <v-card-title class="headline">
          Select Columns
        </v-card-title>
        <v-card-text>
          <SelectColumns
            v-if="step === 1"
            :value="uploadedFile.data"
            :column-selections="columnSelections"
            :first-row-header="firstRowHeader"
            @update-selections="updateSelections"
            @update-first-row-header="updateFirstRowHeader"
            @update-is-complete="updateIsComplete"
          />
          <Geocoder
            :addresses="addresses"
            @update-location="updateLocation"
            @finish="finish"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="reset"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            :disabled="finishIsDisabled || (uploadedFile && (uploadedFile.data.length === 1 && firstRowHeader))"
            @click="finish"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  name: "UploadWorkflow",
  components: {
    Upload,
    SelectColumns,
    Geocoder,
    Loading,
  },
})
export default class UploadWorkflow extends Vue {
  /**
   * Color of the upload button
   */
  @Prop({ default: "#eeeeee" })
  private color!: string;
  /**
   * Whether or not to wrap options into a dropdown
   */
  @Prop({ type: Boolean, default: false })
  private small!: boolean;

  private step: number = 0;
  private uploadedFile: { data: any[][]; fileName: string } | null = null;
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
    zip: null,
  };
  private firstRowHeader: boolean = true;
  private finishIsDisabled: boolean = true;
  private addresses: string[] = [];
  private loading: boolean = false;
  private numberGeocoded: number = 0;

  private get visible() {
    return this.step > 0;
  }
  private set visible(newValue: boolean) {}

  private fileUploaded(data: { data: any[][]; fileName: string }) {
    this.uploadedFile = data;
    this.columnSelections = UploadWorkflowLogic.guessColumnTypes(data.data);
    this.firstRowHeader = UploadWorkflowLogic.guessFirstRowHeader(data.data);
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
    const row = this.uploadedFile!.data[payload.index + offset];
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
        toUpload: true,
        toSaveChanges: true,
        fileName: this.uploadedFile!.fileName,
        data: this.uploadedFile!.data,
        columnSelections: {
          lat: this.columnSelections.lat!,
          lng: this.columnSelections.lng!,
        },
        firstRowHeader: this.firstRowHeader,
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
      this.columnSelections.zip,
    ].filter((_) => _ !== null) as number[];
    this.uploadedFile!.data.forEach((row, index) => {
      this.uploadedFile!.data[index] = row.concat(["", ""]);
    });
    if (this.firstRowHeader) {
      this.uploadedFile!.data[0][this.uploadedFile!.data[0].length - 2] =
        "Latitude";
      this.uploadedFile!.data[0][this.uploadedFile!.data[0].length - 1] =
        "Longitude";
    }
    const offset = this.firstRowHeader ? 1 : 0;
    this.columnSelections.lat = this.uploadedFile!.data[0].length - 2;
    this.columnSelections.lng = this.uploadedFile!.data[0].length - 1;
    /* When addresses is updated, the geocoder is going to start. */
    this.addresses = this.uploadedFile!.data.slice(offset).map((row) => {
      return selections.map((i) => row[i]).join(" ");
    });
    this.loading = true;
  }

  private reset() {
    this.step = 0;
    this.uploadedFile = null;
    this.columnSelections = {
      lat: null,
      lng: null,
      address: null,
      city: null,
      state: null,
      zip: null,
    };
    this.firstRowHeader = true;
    this.finishIsDisabled = true;
    this.addresses = [];
    this.loading = false;
    this.numberGeocoded = 0;
  }
}
</script>