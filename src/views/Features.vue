<template>
  <Page
    v-if="story"
    :blok="story.content"
  />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import storyapi from "@/api/storyblok";
import Page from "@/components/Features/Page/Page.vue";
import StoryI from "@/entities/storyblok/Story";
import _View from "./_View";

/**
 * Storyblok blog landing page
 */
@Component({
  components: {
    Page,
  },
})
export default class Features extends _View {
  private story: StoryI | null = null;

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

  protected activated() {
    super.activated({
      title: "Table & Map - Features",
      content: "Learn more about the many features offered by Table & Map.",
    });
  }
}
</script>