<template>
  <div>
    <Loading :loading="loading" />
    <Page :blok="story.content" :exampleAnalyses="exampleAnalyses" @preview="preview" />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import ExampleAnalysis from "@/entities/ExampleAnalysis";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import examplesApi from "@/api/examples";
import Loading from "@/components/Shared/Loading/Loading.vue";
import Page from "@/components/Examples/Page/Page.vue";
import storyapi from "@/api/storyblok";
import StoryI from "@/entities/storyblok/Story";

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
  private exampleAnalyses: ExampleAnalysis[] = [];
  private loading: boolean = false;

  private async created() {
    this.exampleAnalyses = await examplesApi.getAllExamples();
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

  private async preview(exampleAnalysis: ExampleAnalysis) {
    this.loading = true;
    this.$nextTick(async () => {
      const uploadedFile = new UploadedFile({
        data: (await exampleAnalysis.config.data()).default,
        columnSelections: exampleAnalysis.config.columnSelections,
        firstRowHeader: exampleAnalysis.config.firstRowHeader,
      });
      updateUploadedFile(uploadedFile);
      this.$router.push({ name: "Explore" });
      this.loading = false;
    });
  }
}
</script>