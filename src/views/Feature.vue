<template>
  <div>{{ story }}</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import storyapi from "@/api/blog";

/**
 * Storyblok blog full content page
 */
@Component({
  components: {},
})
export default class Feature extends Vue {
  @Prop()
  private slug!: string;

  private get url() {
    return "feature/" + this.slug;
  }

  private story: null | any = null;

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