<template>
  <component class="full-height" v-if="story" :blok="story.content" :is="story.content.component"></component>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import storyapi from "@/api/blog";
import Page from "./Page.vue";

/**
 * Storyblok blog landing page
 */
@Component({
  components: {
    Page,
  },
})
export default class Features extends Vue {
  private story: null | any = null;

  private created() {
    storyblok.init({
      accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
    });
    storyblok.on("change", async () => {
      this.story = await storyapi.getStory("features", "draft");
    });
    storyblok.pingEditor(async () => {
      if (storyblok.isInEditor()) {
        this.story = await storyapi.getStory("features", "draft");
      } else {
        this.story = await storyapi.getStory("features", "published");
      }
    });
  }
}
</script>