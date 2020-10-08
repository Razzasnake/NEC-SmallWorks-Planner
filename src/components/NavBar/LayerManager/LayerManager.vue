<template>
  <v-dialog
    v-model="visible"
    max-width="600"
    @click:outside="close"
  >
    <v-card>
      <v-card-title class="headline">
        GeoJSON and Shapefile Layers
      </v-card-title>
      <v-card-subtitle>Upload a geojson (.json, .geojson) or shapefile (.zip) and see where your markers fall in relation to the uploaded shapes.</v-card-subtitle>
      <v-card-text class="card-text-area">
        <div
          id="shape-drop-area"
          @click="openUpload"
        >
          <v-icon x-large>
            {{ mdiUpload }}
          </v-icon>
          <div>Drop files here or click to upload</div>
        </div>
        <input
          ref="input"
          :accept="accept"
          multiple="multiple"
          type="file"
          class="upload-input"
          @change="uploadLayers($event.target.files)"
        >
        <v-data-table
          v-if="tableData.length"
          :headers="headers"
          :items="tableData"
        >
          <template #item.actions="{ item }">
            <div class="float-right">
              <v-progress-circular
                v-if="item.data === null"
                indeterminate
                :size="20"
                :width="2"
              />
              <v-btn
                v-else
                text
                color="error"
                @click="removeLayer(item)"
              >
                Delete
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="close"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state, { uploadLayer, removeLayer } from "@/store/exploreStore";
import UploadLogic from "@/components/UploadWorkflow/Upload/UploadLogic";
import { mdiUpload } from "@mdi/js";

/**
 * Modal to manage the uploaded shape files
 */
@Component({
  components: {},
})
export default class LayerManager extends Vue {
  private visible: boolean = true;
  private accept: string = ".json,.geojson,.zip";
  private mdiUpload = mdiUpload;

  private headers = [
    { text: "File Name", value: "fileName" },
    { text: "", value: "actions", sortable: false },
  ];

  private get tableData() {
    return state.layers;
  }

  private mounted() {
    UploadLogic.initDropZone(
      "shape-drop-area",
      this.accept,
      this.uploadLayer,
      true
    );
  }

  private openUpload() {
    (this.$refs.input as HTMLInputElement).click();
  }

  private uploadLayers(fileArray: FileList) {
    Array.from(fileArray).forEach((file) => {
      this.uploadLayer(file);
    });
  }

  private uploadLayer(file: File) {
    uploadLayer(file);
    (this.$refs.input as HTMLInputElement).value = "";
  }

  private removeLayer(item: {
    fileName: string;
    id: string;
    data: object | null;
  }) {
    removeLayer(item);
  }

  private close() {
    this.visible = false;
    /**
     * Close the modal
     */
    this.$emit("close");
  }
}
</script>
<style lang="scss" scoped>
.card-text-area {
  max-height: calc(100vh - 184px);
  overflow: auto;
  #shape-drop-area {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100px;
    border: 2px dashed #eeeeee;
    &.highlight,
    &:hover {
      border: 2px dashed #bdbdbd;
    }
  }
  .upload-input {
    display: none;
  }
}
</style>