<template>
  <FeatureComponent
    v-if="story"
    :blok="story.content"
    @finish="finish"
    @previewExamples="previewExamples"
  />
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import FeatureComponent from "@/components/Features/Feature/Feature.vue";
import storyapi from "@/api/storyblok";
import StoryI from "@/entities/storyblok/Story";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";

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

  @Watch("slug")
  private slugChanged() {
    this.story = null;
    storyblok.init({
      accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
    });
    storyblok.on("change", async () => {
      this.story = await storyapi.getStory(this.url, "draft");
      if (this.story === null) {
        this.$router.push({ name: "404" });
      }
      this.updateTitleDescription();
    });
    storyblok.pingEditor(async () => {
      if (storyblok.isInEditor()) {
        this.story = await storyapi.getStory(this.url, "draft");
      } else {
        this.story = await storyapi.getStory(this.url, "published");
      }
      if (this.story === null) {
        this.$router.push({ name: "404" });
      }
      this.updateTitleDescription();
    });
  }

  private get url() {
    return "features/" + this.slug;
  }

  private created() {
    this.slugChanged();
  }

  private activated() {
    this.updateTitleDescription();
  }

  private updateTitleDescription() {
    if (this.story) {
      document.title = `Table & Map - ${this.story.content.title}`;
      const title = document.getElementsByName("title");
      if (title.length) {
        (title[0] as HTMLMetaElement).content = document.title;
      }
      const description = document.getElementsByName("description");
      if (description.length) {
        (description[0] as HTMLMetaElement).content = this.story.content.subtitle;
      }
    }
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
    this.$router.push({ name: "Explore" });
  }

  private previewExamples() {
    this.$router.push({ name: "Examples" });
  }
}
</script>