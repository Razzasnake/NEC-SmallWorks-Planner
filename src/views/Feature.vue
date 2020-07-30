<template>
  <FeatureComponent v-if="story" :blok="story.content" />
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import FeatureComponent from "@/components/Features/Feature.vue";
import storyapi from "@/api/storyblok";
import StoryI from "@/entities/storyblok/Story";

/**
 * Storyblok blog full content page
 */
@Component({
  components: {
    FeatureComponent,
  },
})
export default class Feature extends Vue {
  /**
   * Slug of the feature
   */
  @Prop()
  private slug!: string;

  private story: StoryI | null = null;

  private get url() {
    return "feature/" + this.slug;
  }

  private created() {
    storyblok.init({
      accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
    });
    storyblok.on("change", async () => {
      this.story = await storyapi.getStory(this.url, "draft");
    });
    storyblok.pingEditor(async () => {
      if (storyblok.isInEditor()) {
        this.story = await storyapi.getStory(this.url, "draft");
      } else {
        this.story = await storyapi.getStory(this.url, "published");
      }
    });
  }
}
</script>