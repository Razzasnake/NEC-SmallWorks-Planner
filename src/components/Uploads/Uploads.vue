<template>
  <v-card class="margin-large">
    <UploadsTable :files="files" @rowClicked="rowClicked" />
  </v-card>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadsTable from "./UploadsTable/UploadsTable.vue";

/**
 * Uploads section where a user can manage their documents
 */
@Component({
  components: {
    UploadsTable,
  },
})
export default class Uploads extends Vue {
  /**
   * List of files to display in the table
   */
  @Prop({ default: [] })
  private files!: gapi.client.drive.File[];

  private rowClicked(file: gapi.client.drive.File) {
    /**
     * Notify parent to download this row and start the tool with it
     *
     * @type {gapi.client.drive.File}
     */
    this.$emit("rowClicked", file);
  }
}
</script>