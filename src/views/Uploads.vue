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

interface Config {
  columnSelections: {
    lat: number;
    lng: number;
  };
  firstRowHeader: boolean;
}

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
    if (files.file.id && files.configFile.id) {
      const worker = new ParserWorker();
      worker.postMessage({
        file: await downloadFile(files.file.id),
        type: "buffer",
      });
      worker.onmessage = async (event) => {
        const config: Config = JSON.parse(
          await downloadFile(files.configFile.id!)
        ) as any;
        const uploadedFile = new UploadedFile({
          fileName: files.file.name!,
          data: event.data.data,
          columnSelections: config.columnSelections,
          firstRowHeader: config.firstRowHeader,
        });
        worker.terminate();
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