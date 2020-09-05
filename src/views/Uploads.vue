<template>
  <UploadsComponent :files="files" @rowClicked="rowClicked" />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state, { downloadFile } from "@/store/driveStore";
import UploadsComponent from "@/components/Uploads/Uploads.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";

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

  private async rowClicked(file: gapi.client.drive.File) {
    if (file.id) {
      const uploadedDocument = await downloadFile(file.id);
      console.log(uploadedDocument);
    }
  }
}
</script>