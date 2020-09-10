import Vue from "vue";
import exploreState, { saveUploadedFile, downloadUserUpload } from "./exploreStore";
import router from "@/router";

interface DriveStoreI {
  user: gapi.auth2.GoogleUser | null,
  files: gapi.client.drive.File[],
  folderId: string | null
};

const state: DriveStoreI = Vue.observable({
  user: null,
  files: [],
  folderId: null
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
      refreshFiles(() => {
        if (exploreState.uploadedFile && exploreState.uploadedFile.toUpload) {
          saveUploadedFile();
        } else {
          directLinkDownloadData();
        }
      });
    }
  });
  gapi.load("auth2", () => {
    gapi.auth2.getAuthInstance().currentUser.listen((val) => {
      if (val.getId() === null) {
        /* TODO: there is no user logged in, try and retrieve it. It might be public. */
        if (router.currentRoute.name === "Explore" && router.currentRoute.params.fileId) {
          router.push({ name: "Home" });
        }
      }
    });
  });
};

const directLinkDownloadData = () => {
  if (router.currentRoute.params.fileId && exploreState.uploadedFile === null) {
    const file = state.files.find((_) => _.id === router.currentRoute.params.fileId);
    if (file) {
      const configFile = state.files.find(
        (_) => _.name === `${file.name}.json`
      )!;
      downloadUserUpload({ file, configFile });
    } else {
      /* TODO: Try to download this file even though the user did not create it. */
      router.push({ name: "404" });
    }
  }
}

export const signOut = () => {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    state.user = null;
    state.files = [];
  });
}

export const refreshFiles = (callback?: () => void | undefined) => {
  gapi.load("client", () => {
    gapi.client.load("drive", "v3", async () => {
      getTableAndMapFolderId((folderId) => {
        state.folderId = folderId;
        retrieveAllFilesInFolder(folderId, (result) => {
          state.files = result;
          if (callback) {
            callback();
          }
        });
      });
    });
  });
};

export const downloadFile = (fileId: string) => {
  return gapi.client.drive.files
    .get({ fileId, alt: "media" })
    .then((response) => {
      return response.body;
    });
}

export const uploadFile = (data: string, mimeType: string, name: string, callback?: (fileName: string) => void | undefined) => {
  const metadata = {
    name,
    mimeType,
    parents: [state.folderId]
  };
  const boundary = "TableAndMap";
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelim = "\r\n--" + boundary + "--";
  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: " + mimeType + "\r\n\r\n" +
    data + "\r\n" +
    closeDelim;
  gapi.client.request({
    path: "https://www.googleapis.com/upload/drive/v3/files",
    method: "POST",
    params: { uploadType: "multipart", fields: "*" },
    headers: {
      "Content-Type": "multipart/related; boundary=" + boundary
    },
    body: multipartRequestBody
  }).execute((resp: any) => {
    if (callback) {
      callback(resp.id);
    }
    const existingFiles = state.files.filter(_ => _.name === name);
    if (existingFiles.length) {
      existingFiles.forEach(existingFile => {
        gapi.client.drive.files.delete({
          fileId: existingFile.id!
        }).execute(() => null);
      });
    }
    state.files = state.files.filter(_ => _.name !== resp.name).concat(resp);
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