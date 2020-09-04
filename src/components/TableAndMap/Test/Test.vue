<template>
  <div>
    <v-btn @click="login">Login</v-btn>
    <div v-if="googleDriveLogic.files.length">
      <tr v-for="(file, index) in googleDriveLogic.files" :key="index">
        <td>{{ file.name }}</td>
        <td>{{ file.mimeType }}</td>
        <td>
          <v-btn @click="downloadFile(file)">Download</v-btn>
        </td>
      </tr>
    </div>
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