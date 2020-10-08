<template>
  <div>
    <Loading :loading="loading" />
    <v-menu v-if="small">
      <template #activator="{ on }">
        <v-btn
          large
          :absolute="$vuetify.breakpoint.xs"
          :bottom="$vuetify.breakpoint.xs"
          :right="$vuetify.breakpoint.xs"
          rounded
          :color="color"
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
        <v-list-item @click="displayPasteModal = true">
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
        @click="displayPasteModal = true"
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

/**
 * Accept a csv or excel file
 */
@Component({
  components: {
    PasteModal,
    Loading,
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

  private mounted() {
    UploadLogic.initDropZone(
      "upload-drop-area",
      this.accept,
      this.fileUploaded,
      false
    );
  }

  private openUpload() {
    (this.$refs.input as HTMLInputElement).click();
  }

  private fileUploaded(file: File) {
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
        /**
         * File has been uploaded
         *
         * @type {{ data: unknown[], fileName: string }}
         */
        this.$emit("file-uploaded", { data: event.data.data, fileName });
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