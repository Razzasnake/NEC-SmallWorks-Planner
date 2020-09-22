<template>
  <UploadsComponent
    :files="files"
    :table-loading="tableLoading"
    @rowClicked="rowClicked"
    @share="share"
    @getLink="getLink"
    @rename="rename"
    @download="download"
    @remove="remove"
    @finish="finish"
  />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import state, { moveToTrashFile } from "@/store/driveStore";
import UploadsComponent from "@/components/Uploads/Uploads.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile, downloadUserUpload } from "@/store/exploreStore";
import _View from "./_View";

/**
 * Display all of the users uploads stored in google drive.
 */
@Component({
  components: {
    UploadsComponent,
  },
})
export default class Uploads extends _View {
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
    downloadUserUpload(files);
  }

  private share(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private getLink(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private rename(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private download(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
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