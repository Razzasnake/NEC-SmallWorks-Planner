<template>
  <Page @finish="finish" />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import Page from "@/components/Features/Page/Page.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import _View from "./_View";

/**
 * Features landing page
 */
@Component({
  name: "ViewsFeatures",
  components: {
    Page,
  },
})
export default class Features extends _View {
  protected activated() {
    super.activated({
      title: "Table & Map - Features",
      content: "Learn more about how Table & Map helps you understand your location data.",
    });
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>