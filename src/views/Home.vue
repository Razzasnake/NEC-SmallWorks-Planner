<template>
  <HomeComponent @finish="finish" />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import HomeComponent from "@/components/Home/Home/Home.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import _View from "./_View";

/**
 * Home page to display to first visitors
 */
@Component({
  components: {
    HomeComponent,
  },
})
export default class Home extends _View {
  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }

  protected activated() {
    super.activated();
  }
}
</script>