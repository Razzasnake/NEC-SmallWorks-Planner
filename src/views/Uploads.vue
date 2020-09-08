<template>
  <UploadsComponent :files="files" @rowClicked="rowClicked" @finish="finish" />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state from "@/store/driveStore";
import UploadsComponent from "@/components/Uploads/Uploads.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile, downloadUserUpload } from "@/store/exploreStore";

/**
 * Display all of the users uploads stored in google drive.
 */
@Component({
  components: {
    UploadsComponent,
  },
})
export default class Uploads extends Vue {
  private get files() {
    return state.files;
  }

  private activated() {
    document.title = "Table & Map - Uploads";
    const title = document.getElementsByName("title");
    if (title.length) {
      (title[0] as HTMLMetaElement).content = document.title;
    }
    const description = document.getElementsByName("description");
    if (description.length) {
      (description[0] as HTMLMetaElement).content =
        "Visualize your location data in an interactive map. Upload an excel or csv file with addresses or latitudes and longitudes to get started.";
    }
  }

  private async rowClicked(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
  }) {
    downloadUserUpload(files);
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>