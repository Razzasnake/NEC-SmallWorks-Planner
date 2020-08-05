<template>
  <div>
    <Loading :loading="loading" />
    <Page v-if="story" :blok="story.content" @preview="preview" />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { updateUploadedFile } from "@/store/exploreStore";
import Loading from "@/components/Shared/Loading/Loading.vue";
import Page from "@/components/Examples/Page/Page.vue";
import storyapi from "@/api/storyblok";
import StoryI from "@/entities/storyblok/Story";
import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";
import exampleApi from "@/api/example";

/**
 * All examples
 */
@Component({
  components: {
    Page,
    Loading,
  },
})
export default class Examples extends Vue {
  private story: StoryI | null = null;
  private loading: boolean = false;

  private async created() {
    storyblok.init({
      accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
    });
    storyblok.on("change", async () => {
      this.story = await storyapi.getStory("examples", "draft");
    });
    storyblok.pingEditor(async () => {
      if (storyblok.isInEditor()) {
        this.story = await storyapi.getStory("examples", "draft");
      } else {
        this.story = await storyapi.getStory("examples", "published");
      }
    });
  }

  private activated() {
    document.title = "Table & Map - Examples";
  }

  private async preview(teaser: ExampleTeaserI) {
    this.loading = true;
    updateUploadedFile(await exampleApi.getExample(teaser));
    this.$router.push({ name: "Explore" });
    this.loading = false;
  }
}
</script>