<template>
  <div>
    <Loading :loading="loading" />
    <OnUploadUpsell
      v-if="onUploadUpsell"
      @close="onUploadUpsell = false"
    />
    <v-menu v-if="small">
      <template #activator="{ on }">
        <v-btn
          large
          :absolute="$vuetify.breakpoint.xs"
          :bottom="$vuetify.breakpoint.xs"
          :left="$vuetify.breakpoint.xs"
          rounded
          :color="color"
          style="z-index: 1"
          v-on="on"
        >
          <v-icon class="margin-right-small">
            {{ mdiPlus }}
          </v-icon>New
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="openUpload">
          <v-list-item-icon>
            <v-icon>{{ mdiUpload }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Upload a dataset</v-list-item-title>
        </v-list-item>
        <v-list-item @click="openPaste">
          <v-list-item-icon>
            <v-icon>{{ mdiContentPaste }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Paste a dataset</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <div v-else>
      <v-btn
        :color="color"
        @click="openUpload"
      >
        <span>Upload a dataset</span>
      </v-btn>
      <v-btn
        class="margin-left-medium"
        outlined
        :color="color"
        @click="openPaste"
      >
        <span>Paste</span>
      </v-btn>
    </div>
    <input
      ref="input"
      :accept="accept"
      type="file"
      class="upload-input"
      @change="fileUploaded($event.target.files[0])"
    >
    <PasteModal
      v-if="displayPasteModal"
      @close-modal="displayPasteModal = false"
      @upload-text="uploadText"
    />
    <v-snackbar
      v-model="snackbar"
      color="error"
      top
      rounded="pill"
    >
      <div class="align-center">
        Upload failed. Please try again or upload a different file.
      </div>
    </v-snackbar>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import PasteModal from "./PasteModal/PasteModal.vue";
import ParserWorker from "worker-loader!./Parser.worker";
import Loading from "@/components/Shared/Loading/Loading.vue";
import { mdiUpload, mdiPlus, mdiContentPaste } from "@mdi/js";
import UploadLogic from "./UploadLogic";
import state from "@/store/driveStore";
import OnUploadUpsell from "@/components/Pricing/Upsell/OnUpload/OnUpload.vue";

/**
 * Accept a csv or excel file
 */
@Component({
  name: "UploadWorkflowUpload",
  components: {
    PasteModal,
    Loading,
    OnUploadUpsell,
  },
})
export default class Upload extends Vue {
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

  private accept: string = ".xls,.xlr,.xlt,.xlsx,.xlsm,.xlsb,.csv";
  private loading: boolean = false;
  private displayPasteModal: boolean = false;
  private snackbar: boolean = false;
  private mdiUpload = mdiUpload;
  private mdiPlus = mdiPlus;
  private mdiContentPaste = mdiContentPaste;
  private onUploadUpsell: boolean = false;

  private get exceedLimit() {
    const ids = new Set(
      state.files
        .filter((r) => r.name!.endsWith(".csv"))
        .map((r) => r.name!.split(".")[r.name!.split(".").length - 2])
    );
    return ids.size > 4;
  }

  private mounted() {
    UploadLogic.initDropZone(
      "upload-drop-area",
      this.accept,
      this.fileUploaded,
      false
    );
  }

  private openUpload() {
    if (state.tier === 0 && this.exceedLimit) {
      this.onUploadUpsell = true;
    } else {
      (this.$refs.input as HTMLInputElement).click();
    }
  }

  private openPaste() {
    if (state.tier === 0 && this.exceedLimit) {
      this.onUploadUpsell = true;
    } else {
      this.displayPasteModal = true;
    }
  }

  private fileUploaded(file: File) {
    if (state.tier === 0 && this.exceedLimit) {
      this.onUploadUpsell = true;
    } else {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        if (e.target) {
          const bstr = e.target.result;
          const fileNameArr = file.name.split(".");
          this.convert(
            `${fileNameArr
              .slice(0, fileNameArr.length - 1)
              .join(".")}.${Math.random().toString(36).substring(7)}.csv`,
            bstr,
            "binary"
          );
        }
      };
      reader.readAsBinaryString(file);
    }
    (this.$refs.input as HTMLInputElement).value = "";
  }

  private convert(
    fileName: string,
    file: string | ArrayBuffer | null,
    type: "binary" | "buffer"
  ) {
    this.loading = true;
    const worker = new ParserWorker();
    worker.postMessage({ file, type });
    worker.onmessage = (event) => {
      if (event.data.error) {
        this.snackbar = true;
      } else {
        if (
          event.data.data.length <=
            parseInt(process.env.VUE_APP_STRIPE_MAX_ROWS!) ||
          state.tier === 1
        ) {
          /**
           * File has been uploaded
           *
           * @type {{ data: unknown[], fileName: string }}
           */
          this.$emit("file-uploaded", { data: event.data.data, fileName });
        } else {
          this.onUploadUpsell = true;
        }
      }
      this.loading = false;
      worker.terminate();
    };
  }

  private uploadText(text: string) {
    this.convert(
      `pasted-dataset.${Math.random().toString(36).substring(7)}.csv`,
      text,
      "buffer"
    );
  }
}
</script>
<style lang="scss" scoped>
.upload-input {
  display: none;
}
.paste {
  color: inherit;
  font-weight: 500;
}
</style>