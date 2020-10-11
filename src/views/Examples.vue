<template>
  <Page @finish="finish" />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import { updateUploadedFile } from "@/store/exploreStore";
import Page from "@/components/Examples/Page/Page.vue";
import _View from "./_View";
import UploadedFile from "@/entities/UploadedFile";

/**
 * All examples
 */
@Component({
  components: {
    Page,
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

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>