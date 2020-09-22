<template>
  <div class="uploads">
    <Navigation
      :class="{'margin-large': !$vuetify.breakpoint.xs}"
      @finish="finish"
    />
    <div class="full-width margin-large">
      <Breadcrumbs />
      <v-divider />
      <Table
        :files="files"
        :table-loading="tableLoading"
        @rowClicked="rowClicked"
        @share="share"
        @getLink="getLink"
        @rename="rename"
        @download="download"
        @remove="remove"
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
  /**
   * Whether or not we are getting the files
   */
  @Prop({ default: false })
  private tableLoading!: boolean

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
    this.$emit("rowClicked", files);
  }

  private share(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    /**
     * Notify parent to share this file
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("share", files);
  }

  private getLink(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    /**
     * Notify parent to get the link of this file
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("getLink", files);
  }

  private rename(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    /**
     * Notify parent to rename this file
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("rename", files);
  }

  private download(files: {
    file: gapi.client.drive.File;
    configFile: gapi.client.drive.File;
    geojsonFile: gapi.client.drive.File | undefined;
  }) {
    /**
     * Notify parent to download this file
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("download", files);
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