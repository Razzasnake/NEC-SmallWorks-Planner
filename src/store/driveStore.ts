import Vue from "vue";
import exploreState, { saveUploadedFile, downloadUserUpload } from "./exploreStore";
import router from "@/router";
import slackApi from "@/api/slack";
import { examples } from "@/entities/data";
import lambdaApi from "@/api/lambda";
import LogRocket from "logrocket";

interface DriveStoreI {
  user: gapi.auth2.GoogleUser | null,
  loggedIn: boolean | null,
  files: gapi.client.drive.File[],
  folderId: string | null,
  refreshFilesLoading: boolean,
  tier: number | null
};

declare const $crisp: any;

const state: DriveStoreI = Vue.observable({
  user: null,
  loggedIn: null,
  files: [],
  folderId: null,
  refreshFilesLoading: true,
  tier: null
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
    onsuccess: async (user) => {
      state.user = user;
      state.loggedIn = true;
      const profile = user.getBasicProfile();
      await lambdaApi.getCustomerTier(profile.getEmail()).then(tier => {
        state.tier = tier;
      });
      if ($crisp) {
        $crisp.push(["set", "user:email", [profile.getEmail()]]);
        $crisp.push(["set", "user:nickname", [profile.getName()]]);
        $crisp.push(["set", "user:avatar", [profile.getImageUrl()]]);
      }
      if (process.env.NODE_ENV === "production") {
        LogRocket.identify(profile.getId(), {
          name: profile.getName(),
          email: profile.getEmail()
        });
        slackApi.login(profile.getName(), profile.getEmail());
      }
      refreshFiles(() => {
        if (exploreState.uploadedFile && exploreState.uploadedFile.toUpload) {
          const ids = state.files.filter(r => r.name!.endsWith(".csv"));
          if (ids.length < parseInt(process.env.VUE_APP_STRIPE_MAX_UPLOADS!) || state.tier === 1) {
            saveUploadedFile();
          }
        } else if (exploreState.uploadedFile === null) {
          directLinkDownloadData();
        }
      });
    }
  });
  gapi.load("auth2", () => {
    gapi.auth2.getAuthInstance().currentUser.listen((val) => {
      if (val.getId() === null) {
        state.loggedIn = false;
        directLinkDownloadData();
      }
    });
  });
};

export const directLinkDownloadData = () => {
  const fileId = router.currentRoute.params.fileId;
  if (fileId) {
    const configFile = state.files.find((_) => _.id === fileId);
    if (configFile) {
      const file = state.files.find(
        (_) => _.name === `${configFile.name!.split(".").slice(0, -1).join(".")}`
      )!;
      const geojsonFile = state.files.find(
        (_) => _.name === `${file.name}.geojson.json`
      )!;
      downloadUserUpload({ file, configFile, geojsonFile }, true);
    } else {
      const exampleDataset = examples.find(e => e.title.toLowerCase().split(" ").join("-") === fileId);
      if (!exampleDataset) {
        gapi.load("client", () => {
          const token = gapi.client.getToken();
          gapi.client.setToken(null);
          gapi.client.setApiKey(process.env.VUE_APP_LOGGED_OUT_USER_API_KEY);
          gapi.client.load("drive", "v3", async () => {
            downloadFile(fileId).then(resp => {
              const body = JSON.parse(resp);
              gapi.client.drive.files.get({
                fileId: body.ids.file
              }).execute((resp) => {
                downloadUserUpload({
                  file: {
                    id: body.ids.file,
                    name: resp.result.name
                  },
                  configFile: {
                    id: fileId
                  },
                  geojsonFile: {
                    id: body.ids.geojsonFile
                  }
                }, false).then(() => {
                  gapi.client.setToken(token);
                });
              });
            }).catch(() => {
              router.push({ name: "404" });
            });
          });
        });
      }
    }
  }
}

export const signOut = () => {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    if (exploreState.uploadedFile) {
      exploreState.uploadedFile.toUpload = false;
      exploreState.uploadedFile.toSaveChanges = false;
    }
    state.user = null;
    state.loggedIn = false;
    state.files = [];
    state.folderId = null;
    state.refreshFilesLoading = true;
    state.tier = null;
    if (router.currentRoute.name === "Uploads" || router.currentRoute.name === "Account") {
      router.push({ name: "Home" });
    }
  });
}

export const refreshFiles = (callback?: () => void | undefined) => {
  state.refreshFilesLoading = true;
  gapi.load("client", () => {
    gapi.client.load("drive", "v3", async () => {
      getTableAndMapFolderId((folderId) => {
        state.folderId = folderId;
        retrieveAllFilesInFolder(folderId, (result) => {
          if (state.tier === 0) {
            const ids = result.filter(r => r.name!.endsWith(".csv"))
              .slice(0, parseInt(process.env.VUE_APP_STRIPE_MAX_UPLOADS!))
              .map(r => r.name!.split(".")[r.name!.split(".").length - 2]);
            state.files = result.filter(r => {
              for (const id of ids) {
                if (r.name!.indexOf(id) > -1) {
                  return true;
                }
              }
              return false;
            });
          } else {
            state.files = result;
          }
          state.refreshFilesLoading = false;
          if (callback) {
            callback();
          }
        });
      });
    });
  });
};

export const updateShared = (files: gapi.client.drive.File[], shared: boolean) => {
  files.forEach(file => {
    if (shared) {
      return gapi.client.drive.permissions.create({
        resource: {
          type: "anyone",
          role: "reader"
        },
        fileId: file.id!
      }).execute(() => null);
    } else {
      return gapi.client.drive.permissions.delete({
        permissionId: "anyoneWithLink",
        fileId: file.id!
      }).execute(() => null);
    }
  });
  files.forEach(f => {
    const file = state.files.find(_ => _.id === f.id);
    if (file) {
      file.shared = shared;
    }
  });
}

export const downloadFile = (fileId: string) => {
  return gapi.client.drive.files
    .get({ fileId, alt: "media" })
    .then((response) => {
      return response.body;
    });
}

export const uploadFile = (data: string, mimeType: string, name: string, id?: string | undefined, callback?: (file: gapi.client.drive.File) => void | undefined) => {
  const metadata: { name: string, mimeType: string, parents?: string[] | undefined } = {
    name,
    mimeType
  };
  if (!id) {
    metadata.parents = [state.folderId!];
  }
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
    path: "https://www.googleapis.com/upload/drive/v3/files" + (id ? `/${id}` : ""),
    method: id ? "PATCH" : "POST",
    params: { uploadType: "multipart", fields: "*" },
    headers: {
      "Content-Type": "multipart/related; boundary=" + boundary
    },
    body: multipartRequestBody
  }).execute((resp: any) => {
    if (!id) {
      const existingFiles = state.files.filter(_ => _.name === name);
      if (existingFiles.length) {
        existingFiles.forEach(existingFile => {
          gapi.client.drive.files.delete({
            fileId: existingFile.id!
          }).execute(() => null);
        });
      }
    }
    state.files = state.files.filter(_ => _.name !== name).concat(resp);
    if (callback) {
      callback(resp);
    }
  });
}

export const moveToTrashFile = (fileId: string) => {
  gapi.client.drive.files.update({ fileId, resource: { trashed: true } }).then(() => null);
  state.files = state.files.filter(_ => _.id !== fileId);
}

export const renameFile = (fileId: string, fileName: string) => {
  gapi.client.drive.files.update({ fileId, resource: { name: fileName } }).then(() => null);
  const file = state.files.find(_ => _.id === fileId);
  if (file) {
    file.name = fileName;
  }
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
