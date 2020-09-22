<template>
  <BasePage
    v-editable="blok"
    :title="blok.title"
    :subtitle="blok.subtitle"
    :img="blok.preview.filename"
    @finish="finish"
  >
    <!-- eslint-disable vue/no-v-html -->
    <template v-if="blok.abstract">
      <h5
        class="text-h5"
        v-html="createHtml(blok.abstract)"
      />
      <v-divider class="margin-bottom-large margin-top-large" />
    </template>
    <div
      class="margin-bottom-large"
      v-html="createHtml(blok.content)"
    />
    <!--eslint-enable-->
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import StoryblokClient from "storyblok-js-client";
import FeatureI from "@/entities/storyblok/Feature";
import BasePage from "@/components/Shared/Page/Page.vue";
import UploadedFile from "@/entities/UploadedFile";

const Storyblok = new StoryblokClient({
  accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
});

/**
 * Storyblok feature component
 */
@Component({
  components: {
    BasePage,
  },
})
export default class Feature extends Vue {
  /**
   * All of the content for this feature
   */
  @Prop()
  private blok!: FeatureI;

  private createHtml(richText: object) {
    return Storyblok.richTextResolver.render(richText);
  }

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
<style lang="scss" scoped>
.info-description {
  margin-bottom: 42px;
}
.card-actions {
  position: absolute;
  bottom: 8px;
  right: 0px;
}
</style>