export default class GoogleDriveLogic {

  public files: gapi.client.drive.File[] = [];

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
          gapi.client.load("drive", "v3", async () => {
            this.getTableAndMapFolderId((folderId) => {
              this.retrieveAllFilesInFolder(folderId, (result) => {
                this.files = result;
              });
            });
          });
        });
      });
    });
  }

  public getWebContentLink(
    fileId: string,
    callback: (webContentLink: string) => void
  ) {
    gapi.client.drive.files
      .get({ fileId, fields: "webContentLink" })
      .execute((file) => {
        if (file.result.webContentLink) {
          callback(file.result.webContentLink);
        }
      });
  }

  private getTableAndMapFolderId(callback: (folderId: string) => void) {
    const mimeType = "application/vnd.google-apps.folder";
    const name = "tableandmap.com";
    const q = `mimeType = '${mimeType}' and trashed = false and name='${name}'`;
    gapi.client.drive.files.list({ pageSize: 1, q }).then((response) => {
      const folders = response.result.files;
      if (folders && folders.length) {
        if (folders[0].id) {
          callback(folders[0].id);
        }
      } else {
        gapi.client.drive.files
          .create({
            resource: {
              name,
              mimeType,
            },
          })
          .execute((resp) => {
            if (resp.result.id) {
              callback(resp.result.id);
            }
          });
      }
    });
  }

  private retrieveAllFilesInFolder(
    folderId: string,
    callback: (files: gapi.client.drive.File[]) => void
  ) {
    gapi.client.drive.files
      .list({ pageSize: 1000, q: `'${folderId}' in parents` })
      .execute((files) => {
        if (files.result.files) {
          callback(files.result.files);
        } else {
          callback([]);
        }
      });
  }
}