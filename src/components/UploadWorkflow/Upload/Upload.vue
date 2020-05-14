<template>
  <b-field>
    <b-loading :active="loading"></b-loading>
    <b-upload v-model="dropFiles" @input="fileUploaded" :accept="accept">
      <a class="button is-primary">
        <font-awesome-icon icon="upload" class="margin-right-8" />
        <span class="margin-left-8">Upload a dataset</span>
      </a>
    </b-upload>
  </b-field>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { read, utils } from "xlsx";

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
    this.loading = true;
    const reader = new FileReader();
    reader.onloadend = e => {
      try {
        if (e.target) {
          const bstr = e.target.result;
          const json = this.convert(bstr);
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

  private convert(file: string | ArrayBuffer | null) {
    const workbook = read(file, { type: "binary" });
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
}
</script>
<style lang='scss' scoped>
.margin-right-8 {
  margin-right: 8px;
}
</style>