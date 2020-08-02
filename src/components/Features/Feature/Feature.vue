<template>
  <BasePage
    :title="blok.title"
    :subtitle="blok.subtitle"
    :img="blok.preview.filename"
    v-editable="blok"
  >
    <template v-if="blok.abstract">
      <div class="text-h5" v-html="createHtml(blok.abstract)"></div>
      <v-divider class="margin-bottom-large margin-top-large" />
    </template>
    <div v-html="createHtml(blok.content)"></div>
    <iframe
      v-if="blok.youtubeUrl.url"
      width="100%"
      height="500"
      :src="blok.youtubeUrl.url"
      frameborder="0"
    ></iframe>
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import StoryblokClient from "storyblok-js-client";
import Footer from "@/components/Home/Footer/Footer.vue";
import FeatureI from "@/entities/storyblok/Feature";
import BasePage from "@/components/Shared/Page/Page.vue";

const Storyblok = new StoryblokClient({
  accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
});

/**
 * Storyblok feature component
 */
@Component({
  components: {
    BasePage,
    Footer,
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
}
</script>