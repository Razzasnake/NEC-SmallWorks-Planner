<template>
  <b-navbar :shadow="true">
    <template slot="brand">
      <b-navbar-item tag="div">Table &amp; Map</b-navbar-item>
    </template>
    <template slot="end" v-if="displayUpload">
      <b-navbar-item tag="div">
        <UploadWorkflow @finish="finish"></UploadWorkflow>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadedFile from "@/entities/UploadedFile";
import UploadWorkflow from "@/components/UploadWorkflow/UploadWorkflow.vue";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    UploadWorkflow
  }
})
export default class NavBar extends Vue {
  /**
   * Whether or not to display the Click to upload button in the top-right
   */
  @Prop({ default: true })
  private displayUpload!: boolean

  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang='scss' scoped>
</style>