<template>
  <Page v-if="story" :blok="story.content" @learnMore="learnMore"></Page>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import storyapi from "@/api/storyblok";
import Page from "@/components/Features/Page/Page.vue";
import StoryI from "@/entities/storyblok/Story";

/**
 * Storyblok blog landing page
 */
@Component({
  components: {
    Page,
  },
})
export default class Features extends Vue {
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

  private activated() {
    document.title = "Table & Map - Features";
    const description = document.getElementsByName("description");
    if (description.length) {
      (description[0] as HTMLMetaElement).content =
        "Learn more about the many features offered by Table & Map.";
    }
  }

  private learnMore(blok: any) {
    this.$router.push(blok.feature.cached_url);
  }
}
</script>