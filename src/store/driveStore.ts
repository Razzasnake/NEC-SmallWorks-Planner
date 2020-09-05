import Vue from "vue";

interface DriveStoreI {
  user: gapi.auth2.GoogleUser | null,
  files: gapi.client.drive.File[]
};

const state: DriveStoreI = Vue.observable({
  user: null,
  files: []
});

export const signIn = (id: string) => {
  const scope = [
    "email",
    "profile",
    "openid",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
  ];
  gapi.signin2.render(id, {
    scope: scope.join(" "),
    width: 100,
    onsuccess: (user) => {
      state.user = user;
      refreshFiles();
    }
  });
};

export const signOut = () => {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    state.user = null;
    state.files = [];
  });
}

export const refreshFiles = () => {
  gapi.load("client", () => {
    gapi.client.load("drive", "v3", async () => {
      getTableAndMapFolderId((folderId) => {
        retrieveAllFilesInFolder(folderId, (result) => {
          state.files = result;
        });
      });
    });
  });
};

export const downloadFile = (fileId: string) => {
  return gapi.client.drive.files
    .get({ fileId, alt: 'media' })
    .then((response) => {
      return response.body;
    });
}

const getTableAndMapFolderId = (callback: (folderId: string) => void) => {
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
};

const retrieveAllFilesInFolder = (
  folderId: string,
  callback: (files: gapi.client.drive.File[]) => void
) => {
  gapi.client.drive.files
    .list({ pageSize: 1000, q: `'${folderId}' in parents and trashed = false`, fields: '*' })
    .execute((files) => {
      if (files.result.files) {
        callback(files.result.files);
      } else {
        callback([]);
      }
    });
};

export default state;