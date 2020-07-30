<template>
  <div v-editable="blok" class="full-height">
    <div class="section">
      <div class="section-header">
        <div>
          <div class="text-h4" v-html="createHtml(blok.title)"></div>
          <div class="text-subtitle-1" v-html="createHtml(blok.subtitle)"></div>
        </div>
      </div>
    </div>
    <div class="content section">
      <div class="feature">
        <div v-html="createHtml(blok.content)"></div>
        <iframe
          v-if="blok.youtubeUrl"
          width="100%"
          height="500"
          :src="blok.youtubeUrl.url"
          frameborder="0"
        ></iframe>
      </div>
    </div>
    <Footer class="section" />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import StoryblokClient from "storyblok-js-client";
import Footer from "@/components/Home/Footer/Footer.vue";

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
  private blok: any;

  private createHtml(richText: object) {
    return Storyblok.richTextResolver.render(richText);
  }
}
</script>
<style lang='scss' scoped>
.section-header {
  height: 200px;
  margin: 3rem 1.5rem;
  display: flex;
  align-items: center;
  max-width: 1024px;
  margin: auto;
}
.content {
  background-color: #eeeeee;
  .feature {
    max-width: 1024px;
    margin: auto;
  }
}
</style>