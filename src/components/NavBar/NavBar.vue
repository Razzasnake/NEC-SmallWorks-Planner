<template>
  <nav class="navbar is-light">
    <div class="navbar-start">
      <div class="navbar-item">
        <div @click="goHome" class="clickable">Table &amp; Map</div>
      </div>
      <div class="navbar-item" v-if="inAnalysis">
        <FileOption class="navbar-item" @clearFilters="clearFilters"></FileOption>
      </div>
      <div class="navbar-item" v-if="inAnalysis">
        <ViewOption :viewOptions="viewOptions" @updateViewOptions="updateViewOptions"></ViewOption>
      </div>
    </div>
    <div class="navbar-end" v-if="inAnalysis">
      <div class="navbar-item">
        <UploadWorkflow @finish="finish"></UploadWorkflow>
      </div>
    </div>
  </nav>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadedFile from "@/entities/UploadedFile";
import UploadWorkflow from "@/components/UploadWorkflow/UploadWorkflow.vue";
import FileOption from "@/components/NavBar/Options/FileOption/FileOption.vue";
import ViewOption from "@/components/NavBar/Options/ViewOption/ViewOption.vue";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    UploadWorkflow,
    FileOption,
    ViewOption
  }
})
export default class NavBar extends Vue {
  /**
   * Whether or not the user is in an anlysis or not
   */
  @Prop({ default: true })
  private inAnalysis!: boolean;
  /**
   * The current view settings
   */
  @Prop({ default: () => ["table", "map"] })
  private viewOptions!: string[];

  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
  }

  private goHome() {
    /**
     * User wants to go back to the home page
     */
    this.$emit("goHome");
  }

  private clearFilters() {
    /**
     * Clear the filters
     */
    this.$emit("clearFilters");
  }

  private updateViewOptions(viewOptions: string[]) {
    this.viewOptions = viewOptions;
    /**
     * Notify the parent to modify what is in view
     *
     * @type {string[]}
     */
    this.$emit("updateViewOptions", viewOptions);
  }
}
</script>
<style lang='scss' scoped>
.clickable {
  cursor: pointer;
}
</style>