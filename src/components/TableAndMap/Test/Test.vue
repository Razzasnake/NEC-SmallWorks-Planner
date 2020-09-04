<template>
  <div>
    <v-btn @click="login">Login</v-btn>
    <table v-if="googleDriveLogic.files.length">
      <tr>
        <td>Name</td>
        <td>Type</td>
        <td></td>
      </tr>
      <tr v-for="(file, index) in googleDriveLogic.files" :key="index">
        <td>{{ file.name }}</td>
        <td>{{ file.mimeType }}</td>
        <td>
          <v-btn @click="downloadFile(file)">Download</v-btn>
        </td>
      </tr>
    </table>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import GoogleDriveLogic from "./GoogleDriveLogic";

@Component({
  components: {},
})
export default class Test extends Vue {
  private googleDriveLogic = new GoogleDriveLogic();

  private login() {
    this.googleDriveLogic.login();
  }

  private downloadFile(file: gapi.client.drive.File) {
    this.googleDriveLogic.getWebContentLink(file.id!, (webContentLink) => {
      window.open(webContentLink, "_blank");
    });
  }
}
</script>
<style lang='scss' scoped>
</style>s