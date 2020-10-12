<template>
  <BasePage
    :title="feature.title"
    :subtitle="feature.description"
    :img="feature.preview.filename"
    @finish="finish"
  >
    TODO
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import BasePage from "@/components/Shared/Page/Page.vue";
import UploadedFile from "@/entities/UploadedFile";
import TeaserI from '@/entities/storyblok/Teaser';

/**
 * Feature component with content
 */
@Component({
  components: {
    BasePage,
  },
})
export default class Feature extends Vue {
  /**
   * Teaser content for this feature
   */
  @Prop()
  private feature!: TeaserI;

  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     *
     * @type {UploadedFile}
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>