export default class GoogleDriveLogic {

  public files = []

  private scope = [
    "email",
    "profile",
    "openid",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
  ];

  public login() {
    const loginOptions = {
      client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
      scope: this.scope.join(" "),
      response_type: "id_token permission",
    };
    gapi.load("auth2", () => {
      gapi.auth2.authorize(loginOptions, () => {
        gapi.load("client", () => {
          gapi.client.load("drive", "v2", async () => {
            this.getTableAndMapFolderId((folderId: string) => {
              this.retrieveAllFilesInFolder(folderId, (result) => {
                this.files = result;
              });
            });
          });
        });
      });
    });
  }

  private getTableAndMapFolderId(callback: (folderId: string) => void) {
    const mimeType = "application/vnd.google-apps.folder";
    const title = "tableandmap.com";
    const q = `mimeType = '${mimeType}' and trashed = false and title='${title}'`;
    gapi.client.drive.files.list({ pageSize: 1, q }).then((response) => {
      const folders = response.result.items;
      if (folders && folders.length) {
        callback(folders[0].id);
      } else {
        gapi.client.drive.files
          .insert({ resource: { title, mimeType } })
          .execute((resp) => {
            callback(resp.id);
          });
      }
    });
  }

  private retrieveAllFilesInFolder(folderId: string, callback) {
    gapi.client.drive.children
      .list({ pageSize: 1000, folderId })
      .execute((children) => {
        const files = [];
        children.items.forEach((item) => {
          gapi.client.drive.files.get({ fileId: item.id }).execute((file) => {
            files.push(file);
            if (files.length === children.items.length) {
              callback(files);
            }
          });
        });
      });
  }
}