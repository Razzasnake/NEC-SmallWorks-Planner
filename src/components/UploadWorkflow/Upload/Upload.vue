<template>
  <b-field>
    <b-loading :active="loading"></b-loading>
    <b-upload v-model="dropFiles" @input="fileUploaded" :accept="accept">
      <a class="button is-primary">
        <b-icon icon="upload"></b-icon>
        <span>Click to upload</span>
      </a>
    </b-upload>
  </b-field>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import XLSX from "xlsx";

/**
 * Accept a csv or excel file
 */
@Component({
  components: {}
})
export default class Upload extends Vue {
  private dropFiles: File | null = null;
  private accept: string = ".xls,.xlr,.xlt,.xlsx,.xlsm,.xlsb,.csv";
  private loading: boolean = false;

  private fileUploaded(file: File) {
    /**
     * Update the parent with the loading state
     */
    this.loading = true;
    const reader = new FileReader();
    reader.onloadend = e => {
      try {
        if (e.target) {
          const bstr = e.target.result;
          /**
           * File has been uploaded
           */
          const json = this.convert(bstr);
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

  private convert(file: string | ArrayBuffer | null) {
    const workbook = XLSX.read(file, { type: "binary" });    
    const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });
  }

  private handleFailure() {
    this.$buefy.toast.open({
      message: "Upload failed. Please try again or upload a different file.",
      type: "is-danger"
    });
    this.loading = false;
  }
}
</script>
<style lang='scss' scoped>
</style>