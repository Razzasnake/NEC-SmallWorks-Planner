<template>
  <div class="full-height">
    <UploadsComponent
      v-if="loggedIn"
      :files="files"
      :table-loading="tableLoading"
      @row-clicked="rowClicked"
      @update-shared="updateShared"
      @rename="rename"
      @remove="remove"
      @finish="finish"
    />
    <SigninToContinue v-else-if="loggedIn === false" />
  </div>
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import state, { moveToTrashFile, renameFile, updateShared } from "@/store/driveStore";
import UploadsComponent from "@/components/Uploads/Uploads.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile, downloadUserUpload } from "@/store/exploreStore";
import _View from "./_View";
import SigninToContinue from "@/components/Shared/SigninToContinue/SigninToContinue.vue";

/**
 * Display all of the users uploads stored in google drive.
 */
@Component({
  components: {
    UploadsComponent,
    SigninToContinue
  },
})
export default class Uploads extends _View {
  private get loggedIn() {
    return state.loggedIn;
  }

  private get files() {
    return state.files;
  }

  private get tableLoading() {
    return state.refreshFilesLoading;
  }

  protected activated() {
    super.activated({ title: "Table & Map - Uploads" });
  }

  private rowClicked(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    downloadUserUpload(files, true);
  }

  private updateShared(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    const filteredFiles = Object.values(files).filter(_ => _) as gapi.client.drive.File[];
    if (filteredFiles.length) {
      const currentShared = filteredFiles[0].shared!;
      updateShared(filteredFiles, !currentShared);
    }
  }

  private rename(payload: {
    files: {
      file: gapi.client.drive.File;
      configFile: gapi.client.drive.File;
      geojsonFile: gapi.client.drive.File | undefined;
    };
    rename: string;
  }) {
    const configFileName = payload.files.configFile.name!.replace(
      payload.files.file.name!,
      payload.rename
    );
    renameFile(payload.files.configFile.id!, configFileName);
    if (payload.files.geojsonFile) {
      const geojsonFileName = payload.files.geojsonFile.name!.replace(
        payload.files.file.name!,
        payload.rename
      );
      renameFile(payload.files.geojsonFile.id!, geojsonFileName);
    }
    const fileName = payload.files.file.name!.replace(
      payload.files.file.name!,
      payload.rename
    );
    renameFile(payload.files.file.id!, fileName);
  }

  private remove(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    moveToTrashFile(files.file.id!);
    moveToTrashFile(files.configFile.id!);
    if (files.geojsonFile) {
      moveToTrashFile(files.geojsonFile.id!);
    }
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>