<template>
  <div>
    <Loading :loading="loading" />
    <HomeComponent
      @finish="finish"
      @preview="preview"
    />
  </div>
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import HomeComponent from "@/components/Home/Home/Home.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import _View from "./_View";
import exampleApi from "@/api/example";
import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";
import Loading from "@/components/Shared/Loading/Loading.vue";

/**
 * Home page to display to first visitors
 */
@Component({
  components: {
    HomeComponent,
    Loading,
  },
})
export default class Home extends _View {
  private loading: boolean = false;

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }

  private async preview(teaser: ExampleTeaserI) {
    this.loading = true;
    updateUploadedFile(await exampleApi.getExample(teaser));
    this.loading = false;
  }

  protected activated() {
    super.activated();
  }
}
</script>