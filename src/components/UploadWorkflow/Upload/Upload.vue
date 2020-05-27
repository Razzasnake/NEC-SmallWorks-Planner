<template>
  <div class="upload-container">
    <b-field>
      <b-loading :active="loading"></b-loading>
      <b-upload v-model="dropFiles" @input="fileUploaded" :accept="accept">
        <a class="button is-primary">
          <font-awesome-icon icon="upload" class="margin-right-small" />
          <span class="margin-left-8">Upload a dataset</span>
        </a>
      </b-upload>
    </b-field>
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
import { read, utils } from "xlsx";
import PasteModal from "./PasteModal/PasteModal.vue";

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
    this.loading = true;
    const reader = new FileReader();
    reader.onloadend = e => {
      try {
        if (e.target) {
          const bstr = e.target.result;
          const json = this.convert(bstr, "binary");
          /**
           * File has been uploaded
           *
           * @type {unknown[]}
           */
          this.$emit("fileUploaded", json);
          this.dropFiles = null;
          this.loading = false;
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
    const workbook = read(file, { type });
    const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
    return utils.sheet_to_json(firstWorksheet, { header: 1 });
  }

  private handleFailure() {
    this.$buefy.toast.open({
      message: "Upload failed. Please try again or upload a different file.",
      type: "is-danger"
    });
    this.loading = false;
  }

  private uploadText(text: string) {
    this.loading = true;
    setTimeout(() => {
      const json = this.convert(text, "buffer");
      this.$emit("fileUploaded", json);
      this.loading = false;
    });
  }
}
</script>
<style lang='scss' scoped>
.upload-container {
  display: flex;
  align-items: center;
}
</style>