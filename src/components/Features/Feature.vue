<template>
  <Wrapper :blok="blok">
    <div v-html="html" class="feature section"></div>
  </Wrapper>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Wrapper from "./Wrapper.vue";
import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
});

/**
 * Storyblok feature component
 */
@Component({
  components: {
    Wrapper,
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
<style lang="scss" scoped>
.feature {
  max-width: 1024px;
  margin: auto;
}
</style>
