<template>
  <div v-editable="blok" class="full-height">
    <v-img
      class="image-header"
      :src="blok.preview.filename"
      gradient="to top, rgba(16, 84, 106, .75), rgba(16, 84, 106, .75)"
    >
      <div class="section">
        <div class="section-header">
          <div>
            <div class="text-h4" v-html="createHtml(blok.title)"></div>
            <div class="text-subtitle-1" v-html="createHtml(blok.subtitle)"></div>
          </div>
        </div>
      </div>
    </v-img>
    <div class="section">
      <div class="feature">
        <div v-html="createHtml(blok.content)"></div>
        <iframe
          v-if="blok.youtubeUrl.url"
          width="100%"
          height="500"
          :src="blok.youtubeUrl.url"
          frameborder="0"
        ></iframe>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import StoryblokClient from "storyblok-js-client";
import Footer from "@/components/Home/Footer/Footer.vue";
import FeatureI from "@/entities/storyblok/Feature";

const Storyblok = new StoryblokClient({
  accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
});

/**
 * Storyblok feature component
 */
@Component({
  components: {
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
<style lang='scss' scoped>
.image-header {
  display: flex;
  align-items: center;
  height: calc(200px + 6rem);
  width: 100%;
  .section-header {
    max-width: 1215px;
    margin: auto;
    color: #eeeeee;
  }
}
.feature {
  max-width: 1215px;
  margin: auto;
}
</style>