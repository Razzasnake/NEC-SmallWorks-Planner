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

  private fileUploaded(file: File) {
    const reader = new FileReader();
    reader.onloadend = e => {
      try {
        if (e.target) {
          const bstr = e.target.result;
          this.convert(bstr, "binary");
        } else {
          this.handleFailure();
        }
      } catch (e) {
        this.handleFailure();
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
      /**
       * File has been uploaded
       *
       * @type {unknown[]}
       */
      this.$emit("fileUploaded", event.data);
      this.dropFiles = null;
      this.loading = false;
    };
  }

  private handleFailure() {
    this.$buefy.toast.open({
      message: "Upload failed. Please try again or upload a different file.",
      type: "is-danger"
    });
    this.loading = false;
  }

  private uploadText(text: string) {
    this.convert(text, "buffer");
  }
}
</script>
<style lang='scss' scoped>
</style>