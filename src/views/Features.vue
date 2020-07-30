<template>
  <Page
    v-if="story"
    :blok="story.content"
    @learnMore="learnMore"
  ></Page>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import storyapi from "@/api/storyblok";
import Page from "@/components/Features/Page.vue";

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

  private learnMore(blok: any) {
    this.$router.push(blok.feature.cached_url);
  }
}
</script>