<template>
  <div>
    <v-btn @click="login">Login</v-btn>
    <div v-if="googleDriveLogic.files.length">
      <tr v-for="(file, index) in googleDriveLogic.files" :key="index">
        <td>{{ file.title }}</td>
        <td>{{ file.ownerNames }}</td>
        <td>{{ file.modifiedDate }}</td>
        <td>{{ file.quotaBytesUsed }}</td>
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

  private downloadFile(file) {
    window.open(file.webContentLink, "_blank");
  }
}
</script>
<style lang='scss' scoped>
</style>s