<template>
  <v-card class="margin-large">
    <UploadsTable :files="files" @rowClicked="rowClicked" />
  </v-card>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadsTable from "./UploadsTable/UploadsTable.vue";

/**
 * Display all of the users uploads stored in google drive.
 */
@Component({
  components: {
    UploadsTable,
  },
})
export default class Uploads extends Vue {
  @Prop({ default: [] })
  private files!: gapi.client.drive.File[];

  private rowClicked(file: gapi.client.drive.File) {
    /**
     * Notify parent to download this row and start the tool with it
     */
    this.$emit("rowClicked", file);
  }
}
</script>