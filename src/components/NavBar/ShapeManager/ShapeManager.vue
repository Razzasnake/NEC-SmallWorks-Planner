<template>
  <v-dialog v-model="visible" @click:outside="close" max-width="600">
    <v-card>
      <v-card-title class="headline">GeoJSON and Shapefile Layers</v-card-title>
      <v-card-subtitle>Upload a geojson (.json, .geojson) or shapefile (.zip) and see where your markers fall in relation to the uploaded shapes.</v-card-subtitle>
      <v-card-text>
        <div id="shape-drop-area" @click="openUpload">Drop files here or click to upload</div>
        <input
          :accept="accept"
          ref="input"
          type="file"
          class="upload-input"
          @change="uploadShape($event.target.files[0])"
        />
        <v-data-table :headers="headers" :items="tableData">
          <template v-slot:item.actions="{ item }">
            <v-btn text color="error" @click="removeShape(item)" class="float-right">Delete</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state, { uploadShape, removeShape } from "@/store/exploreStore";
import UploadLogic from "@/components/UploadWorkflow/Upload/UploadLogic";

/**
 * Modal to manage the uploaded shape files
 */
@Component({
  components: {},
})
export default class ShapeManager extends Vue {
  private visible: boolean = true;
  private accept: string = ".json,.geojson,.zip";

  private headers = [
    { text: "File Name", value: "file_name" },
    { text: "", value: "actions", sortable: false },
  ];

  private get tableData() {
    return state.shapes;
  }

  private mounted() {
    UploadLogic.initDropZone("shape-drop-area", this.accept, this.uploadShape);
  }

  private openUpload() {
    (this.$refs.input as HTMLInputElement).click();
  }

  private uploadShape(file: File) {
    uploadShape(file);
    (this.$refs.input as HTMLInputElement).value = "";
  }

  private removeShape(item: { file_name: string; id: number; data: object }) {
    removeShape(item);
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
#shape-drop-area {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 2px dashed #eeeeee;
  &.highlight,
  &:hover {
    border: 2px dashed #bdbdbd;
  }
}
.upload-input {
  display: none;
}
</style>