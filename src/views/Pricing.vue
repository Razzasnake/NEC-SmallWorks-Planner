<template>
  <Page @finish="finish" />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import Page from "@/components/Pricing/Page/Page.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import _View from "./_View";

/**
 * Pricing landing page
 */
@Component({
  components: {
    Page,
  },
})
export default class Pricing extends _View {
  protected activated() {
    super.activated({
      title: "Table & Map - Pricing",
      content: "Choose the plan that's right for you or your business.",
    });
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>