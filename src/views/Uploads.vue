<template>
  <div>
    <div class="uploads">
      <div class="body card">
        <div class="columns header">
          <div class="column">
            <div class="subtitle">Uploads ({{ userUploads.length }})</div>
          </div>
          <div class="column align-right">
            <a @click="jumpTo({ name: 'Examples' })">Examples</a>
          </div>
        </div>
        <div v-if="userUploads.length > 0 || loading">
          <b-loading :active="loading"></b-loading>
          <div v-for="upload in userUploads" :key="upload.id" class="upload">
            <Tile :exampleAnalysis="upload" @preview="preview"></Tile>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="description">You haven't uploaded anything</div>
          <div class="body-center">
            <UploadWorkflow @finish="finish"></UploadWorkflow>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "@/components/Examples/Tile/Tile.vue";
import ExampleAnalysis from "@/entities/ExampleAnalysis";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import uploadedFilesApi from "@/api/uploadedFiles";
import UploadWorkflow from "@/components/UploadWorkflow/UploadWorkflow.vue";

@Component({
  components: {
    UploadWorkflow,
    Tile
  }
})
export default class Uploads extends Vue {
  private userUploads: ExampleAnalysis[] = [];
  private loading = true;

  private async created() {
    this.userUploads = await uploadedFilesApi.getAllUploads();
    this.loading = false;
  }

  private preview(exampleAnalysis: ExampleAnalysis) {
    const uploadedFile = new UploadedFile({
      data: exampleAnalysis.config.data,
      columnSelections: exampleAnalysis.config.columnSelections,
      firstRowHeader: exampleAnalysis.config.firstRowHeader
    });
    updateUploadedFile(uploadedFile);
    this.$router.push({ name: "Explore" });
  }

  private jumpTo(location: { name: string }) {
    this.$router.push(location);
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
    this.$router.push({ name: "Explore" });
  }
}
</script>
<style lang="scss" scoped>
.uploads {
  padding: 20px;
  .body {
    max-width: 1024px;
    margin: auto;
    .header {
      margin: 0;
      .align-right {
        text-align: right;
      }
    }
    .upload {
      padding: 12px 12px 0px 12px;
      &:last-of-type {
        padding-bottom: 12px;
      }
    }
    .empty-state {
      text-align: center;
      padding: 12px;
      .description {
        padding: 12px;
      }
      .body-center {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
