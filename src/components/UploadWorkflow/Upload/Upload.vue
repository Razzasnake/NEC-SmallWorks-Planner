<template>
  <div>
    <Loading :loading="loading" />
    <v-btn :accept="accept" :color="color" @click="openUpload">
      <v-icon>{{ mdiUpload }}</v-icon>
      <span class="margin-left-small">Upload a dataset</span>
      <input
        :accept="accept"
        ref="input"
        type="file"
        class="upload-input"
        @change="fileUploaded($event.target.files[0])"
      />
    </v-btn>
    <span class="margin-right-small margin-left-small">or</span>
    <a class="paste" @click="displayPasteModal = true">Paste</a>
    <PasteModal
      v-if="displayPasteModal"
      @closeModal="displayPasteModal = false"
      @uploadText="uploadText"
    ></PasteModal>
    <v-snackbar v-model="snackbar" color="error" top rounded="pill">
      <div class="align-center">Upload failed. Please try again or upload a different file.</div>
    </v-snackbar>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import PasteModal from "./PasteModal/PasteModal.vue";
import ParserWorker from "worker-loader!./Parser.worker";
import Loading from "@/components/Shared/Loading/Loading.vue";
import { mdiUpload } from "@mdi/js";

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
  @Prop({ default: '#eeeeee' })
  private color!: string;

  private accept: string = ".xls,.xlr,.xlt,.xlsx,.xlsm,.xlsb,.csv";
  private loading: boolean = false;
  private displayPasteModal: boolean = false;
  private snackbar: boolean = false;
  private mdiUpload = mdiUpload;

  private mounted() {
    this.initDropZone();
  }

  private initDropZone() {
    /* This element is in the CallToAction class. */
    const dropArea = document.getElementById("upload-drop-area");
    if (dropArea) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(
          eventName,
          (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        );
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.addEventListener(
          eventName,
          (e) => {
            dropArea.classList.add("highlight");
          },
          false
        );
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(
          eventName,
          (e) => {
            dropArea.classList.remove("highlight");
          },
          false
        );
      });

      dropArea.addEventListener(
        "drop",
        (e) => {
          let dt = e.dataTransfer;
          if (dt) {
            const file = dt.files[0];
            if (
              this.accept.split(",").filter((_) => file.name.endsWith(_))
                .length > 0
            ) {
              /* If a supported file. */
              this.fileUploaded(file);
            }
          }
        },
        false
      );
    }
  }

  private openUpload() {
    (this.$refs.input as HTMLInputElement).click();
  }

  private fileUploaded(file: File) {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target) {
        const bstr = e.target.result;
        this.convert(bstr, "binary");
      }
    };
    reader.readAsBinaryString(file);
    (this.$refs.input as HTMLInputElement).value = "";
  }

  private convert(
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
         * @type {unknown[]}
         */
        this.$emit("fileUploaded", event.data.data);
      }
      this.loading = false;
      worker.terminate();
    };
  }

  private uploadText(text: string) {
    this.convert(text, "buffer");
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