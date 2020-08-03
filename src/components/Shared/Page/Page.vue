<template>
  <div>
    <v-img
      class="image-header"
      :src="img"
      gradient="to top, rgba(38, 50, 56, .75), rgba(38, 50, 56, .75)"
    >
      <div class="section">
        <div class="section-header">
          <div>
            <div :class="titleClass" v-if="titleIsString">
              <h1>{{ title }}</h1>
            </div>
            <h1 :class="titleClass" v-else v-html="createHtml(title)"></h1>
            <div class="text-h6" v-if="subtitleIsString">
              <p>{{ subtitle }}</p>
            </div>
            <div class="text-h6" v-else v-html="createHtml(subtitle)"></div>
          </div>
        </div>
      </div>
    </v-img>
    <div class="content section">
      <div class="feature">
        <!-- @slot What to put in the content -->
        <slot></slot>
      </div>
    </div>
    <div class="section">
      <Footer />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import StoryblokClient from "storyblok-js-client";
import Footer from "@/components/Home/Footer/Footer.vue";

const Storyblok = new StoryblokClient({
  accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
});

/**
 * Generic Page component
 */
@Component({
  components: {
    Footer,
  },
})
export default class Page extends Vue {
  /**
   * Title
   */
  @Prop()
  private title!: string | object;
  /**
   * Subtitle
   */
  @Prop()
  private subtitle!: string | object;
  /**
   * Image to appear behind the header
   */
  @Prop({ default: null })
  private img!: string | null;

  private get titleClass() {
    return this.$vuetify.breakpoint.xs ? "text-h3" : "text-h2";
  }

  private get titleIsString() {
    return typeof this.title === "string";
  }

  private get subtitleIsString() {
    return typeof this.subtitle === "string";
  }

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