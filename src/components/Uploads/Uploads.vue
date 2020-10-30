<template>
  <div class="uploads">
    <Navigation
      :class="{'margin-large': !$vuetify.breakpoint.xs}"
      @finish="finish"
    />
    <div class="full-width margin-large">
      <Breadcrumbs :folder-id="folderId" />
      <v-divider />
      <Table
        :files="files"
        :table-loading="tableLoading"
        :folder-id="folderId"
        @row-clicked="rowClicked"
        @update-shared="updateShared"
        @rename="rename"
        @remove="remove"
      />
      <RenameModal
        v-if="filesToRename"
        :name="filesToRename.file.name"
        @confirm="confirmRename"
        @cancel="cancelRename"
      />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Navigation from "./Navigation/Navigation.vue";
import Table from "./Table/Table.vue";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs.vue";
import UploadedFile from "@/entities/UploadedFile";
import RenameModal from "./RenameModal/RenameModal.vue";

/**
 * Uploads section where a user can manage their documents
 */
@Component({
  components: {
    Navigation,
    Breadcrumbs,
    Table,
    RenameModal,
  },
})
export default class Uploads extends Vue {
  /**
   * List of files to display in the table
   */
  @Prop({ default: [] })
  private files!: gapi.client.drive.File[];
  /**
   * Whether or not we are getting the files
   */
  @Prop({ default: false })
  private tableLoading!: boolean;
  /**
   * Google drive folder id
   */
  @Prop({ default: null })
  private folderId!: string;

  private filesToRename: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  } | null = null;

  private rowClicked(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    /**
     * Notify parent to download this row and start the tool with it
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("row-clicked", files);
  }

  private updateShared(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    /**
     * Notify parent to update the shared settings
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("update-shared", files);
  }

  private rename(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    this.filesToRename = files;
  }

  private confirmRename(rename: string) {
    if (this.filesToRename) {
      /**
       * Notify parent to rename this file
       *
       * @type {{ files: { file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }, rename: string }}
       */
      this.$emit("rename", { files: this.filesToRename, rename });
      this.cancelRename();
    }
  }

  private cancelRename() {
    this.filesToRename = null;
  }

  private remove(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    /**
     * Notify parent to remove this file
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("remove", files);
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