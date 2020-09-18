<template>
  <div>
    <Loading :loading="loading" />
    <Page @preview="preview" />
  </div>
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import { updateUploadedFile } from "@/store/exploreStore";
import Loading from "@/components/Shared/Loading/Loading.vue";
import Page from "@/components/Examples/Page/Page.vue";
import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";
import exampleApi from "@/api/example";
import _View from "./_View";

/**
 * All examples
 */
@Component({
  components: {
    Page,
    Loading,
  },
})
export default class Examples extends _View {
  private loading: boolean = false;

  protected activated() {
    super.activated({
      title: "Table & Map - Examples",
      content:
        "See how Table & Map can add value by trying one of our datasets.",
    });
  }

  private async preview(teaser: ExampleTeaserI) {
    this.loading = true;
    updateUploadedFile(await exampleApi.getExample(teaser));
    this.loading = false;
  }
}
</script>