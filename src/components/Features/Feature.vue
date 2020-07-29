<template>
  <div v-editable="blok" class="full-height">
    <div class="section">
      <div class="section-header">
        <div>
          <div class="text-h4">{{ blok.title }}</div>
          <div class="text-subtitle-1">{{ blok.subtitle }}</div>
        </div>
      </div>
    </div>
    <div class="content section">
      <div v-html="html" class="feature section"></div>
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
  private get html() {
    return Storyblok.richTextResolver.render(this.blok.content);
  }
}
</script>
<style lang='scss' scoped>
.section-header {
  height: 200px;
  padding: 3rem 1.5rem;
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