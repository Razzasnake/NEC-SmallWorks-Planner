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
import state from "@/store/driveStore";
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

  private async rowClicked(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    downloadUserUpload(files);
  }

  private async share(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private async getLink(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private async rename(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private async download(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private async remove(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    // TODO
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>