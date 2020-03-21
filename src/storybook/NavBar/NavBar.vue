<template>
  <b-navbar :shadow="true">
    <template slot="brand">
      <b-navbar-item>Table &amp; Map</b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="div">
        <UploadWorkflow @finish="finish"></UploadWorkflow>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadedFile from "@/entities/UploadedFile";
import UploadWorkflow from "@/storybook/UploadWorkflow/UploadWorkflow.vue";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    UploadWorkflow
  }
})
export default class NavBar extends Vue {
  private finish(uploadedFile: UploadedFile) {
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang='scss' scoped>
</style>