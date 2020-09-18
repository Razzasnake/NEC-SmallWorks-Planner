<template>
  <UploadsComponent
    :files="files"
    @rowClicked="rowClicked"
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

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>