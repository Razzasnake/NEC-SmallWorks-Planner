<template>
  <UploadsComponent :files="files" @rowClicked="rowClicked" @finish="finish" />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state, { downloadFile } from "@/store/driveStore";
import UploadsComponent from "@/components/Uploads/Uploads.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import ParserWorker from "worker-loader!@/components/UploadWorkflow/Upload/Parser.worker";

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
      const worker = new ParserWorker();
      worker.postMessage({
        file: await downloadFile(file.id),
        type: "buffer",
      });
      worker.onmessage = (event) => {
        const uploadedFile = new UploadedFile({
          data: event.data.data,
          columnSelections: {
            lat: 10,
            lng: 11,
          },
          firstRowHeader: true,
        });
        updateUploadedFile(uploadedFile);
        this.$router.push({ name: "Explore" });
      };
    }
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
    this.$router.push({ name: "Explore" });
  }
}
</script>