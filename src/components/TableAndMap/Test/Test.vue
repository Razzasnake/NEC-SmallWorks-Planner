<template>
  <div></div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Test extends Vue {
  private scope = [
    "email",
    "profile",
    "openid",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
  ];

  private mounted() {
    const loginOptions = {
      client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
      scope: this.scope.join(" "),
      response_type: "id_token permission",
    };
    gapi.load("auth2", () => {
      gapi.auth2.authorize(loginOptions, () => {
        gapi.load("client", () => {
          gapi.client.load("drive", "v2", () => {
            const folderId = "1P53ifOtRIhMljeKgx3jDaYJbqDC4Am0G";
            this.retrieveAllFilesInFolder(folderId, (result: any[]) => {
              console.log(result)
            })
            // const request = gapi.client.drive.files.get({
            //   fileId: "15oI3NToLIjuTjlGFSTYizA3ZFgc7m5VK",
            //   fields: "webContentLink",
            // });
            // request.execute((resp: any) => {
            //   console.log(resp);
            // });
          });
        });
      });
    });
  }

  private retrieveAllFilesInFolder(folderId, callback) {
    const retrievePageOfChildren = (request, result) => {
      request.execute((resp) => {
        result = result.concat(resp.items);
        const nextPageToken = resp.nextPageToken;
        if (nextPageToken) {
          request = gapi.client.drive.children.list({
            folderId: folderId,
            pageToken: nextPageToken,
          });
          retrievePageOfChildren(request, result);
        } else {
          callback(result);
        }
      });
    };
    const initialRequest = gapi.client.drive.children.list({
      folderId: folderId,
    });
    retrievePageOfChildren(initialRequest, []);
  }
}
</script>
<style lang='scss' scoped>
</style>s