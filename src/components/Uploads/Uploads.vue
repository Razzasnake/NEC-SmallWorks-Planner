<template>
  <div class="uploads">
    <Navigation class="margin-large" @finish="finish" />
    <div class="full-width margin-large">
      <Breadcrumbs />
      <v-divider />
      <Table :files="files" @rowClicked="rowClicked" />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Navigation from "./Navigation/Navigation.vue";
import Table from "./Table/Table.vue";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs.vue";
import UploadedFile from "@/entities/UploadedFile";

/**
 * Uploads section where a user can manage their documents
 */
@Component({
  components: {
    Navigation,
    Breadcrumbs,
    Table,
  },
})
export default class Uploads extends Vue {
  /**
   * List of files to display in the table
   */
  @Prop({ default: [] })
  private files!: gapi.client.drive.File[];

  private rowClicked(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
  }) {
    /**
     * Notify parent to download this row and start the tool with it
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File }}
     */
    this.$emit("rowClicked", files);
  }

  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     *
     * @type {UploadedFile}
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang="scss" scoped>
.uploads {
  display: flex;
  background-color: white;
  height: 100%;
}
</style>