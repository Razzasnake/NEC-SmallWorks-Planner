<template>
  <div>
    <b-loading :active="loading"></b-loading>
    <b-upload v-model="dropFiles" @input="fileUploaded" :accept="accept">
      <a class="button is-primary">
        <font-awesome-icon icon="upload" class="margin-right-small" />
        <span class="margin-left-small">Upload a dataset</span>
      </a>
    </b-upload>
    <span class="margin-right-small margin-left-small">
      <b>or</b>
    </span>
    <a @click="displayPasteModal = true">Paste</a>
    <PasteModal
      v-if="displayPasteModal"
      @closeModal="displayPasteModal = false"
      @uploadText="uploadText"
    ></PasteModal>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import PasteModal from "./PasteModal/PasteModal.vue";
import ParserWorker from "worker-loader!./Parser";

/**
 * Accept a csv or excel file
 */
@Component({
  components: {
    PasteModal
  }
})
export default class Upload extends Vue {
  private dropFiles: File | null = null;
  private accept: string = ".xls,.xlr,.xlt,.xlsx,.xlsm,.xlsb,.csv";
  private loading: boolean = false;
  private displayPasteModal: boolean = false;

  private mounted() {
    this.initDropZone();
  }

  private initDropZone() {
    /* This element is in the CallToAction class. */
    const dropArea = document.getElementById("upload-drop-area");
    if (dropArea) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(
          eventName,
          e => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        );
      });

      ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(
          eventName,
          e => {
            dropArea.classList.add("highlight");
          },
          false
        );
      });

      ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(
          eventName,
          e => {
            dropArea.classList.remove("highlight");
          },
          false
        );
      });

      dropArea.addEventListener(
        "drop",
        e => {
          let dt = e.dataTransfer;
          if (dt) {
            const file = dt.files[0];
            if (this.accept.split(',').filter(_ => file.name.endsWith(_)).length > 0) {
              /* If a supported file. */
              this.fileUploaded(file);
            }
          }
        },
        false
      );
    }
  }

  private fileUploaded(file: File) {
    const reader = new FileReader();
    reader.onloadend = e => {
      if (e.target) {
        const bstr = e.target.result;
        this.convert(bstr, "binary");
      }
    };
    reader.readAsBinaryString(file);
  }

  private convert(
    file: string | ArrayBuffer | null,
    type: "binary" | "buffer"
  ) {
    this.loading = true;
    const worker = new ParserWorker();
    worker.postMessage({ file, type });
    worker.onmessage = event => {
      if (event.data.error) {
        this.$buefy.toast.open({
          message:
            "Upload failed. Please try again or upload a different file.",
          type: "is-danger"
        });
      } else {
        /**
         * File has been uploaded
         *
         * @type {unknown[]}
         */
        this.$emit("fileUploaded", event.data.data);
      }
      this.dropFiles = null;
      this.loading = false;
    };
  }

  private uploadText(text: string) {
    this.convert(text, "buffer");
  }
}
</script>
<style lang='scss' scoped>
</style>