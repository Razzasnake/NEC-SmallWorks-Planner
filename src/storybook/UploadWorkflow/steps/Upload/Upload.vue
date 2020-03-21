<template>
  <b-field>
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

  private fileUploaded(file: File) {
    const reader = new FileReader();
    reader.onloadend = e => {
      try {
        if (e.target) {
          const bstr = e.target.result;
          /**
           * File has been uploaded
           */
          this.$emit("fileUploaded", this.convert(bstr));
          this.dropFiles = null
        } else {
          this.handleFailure(file);
        }
      } catch (e) {
        this.handleFailure(file);
      }
    };
    reader.readAsBinaryString(file);
  }

  private convert(file: string | ArrayBuffer | null) {
    const workbook = XLSX.read(file, { type: "buffer" });
    const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });
  }

  private handleFailure(file: File) {
    // TODO
  }
}
</script>
<style lang='scss' scoped>
</style>