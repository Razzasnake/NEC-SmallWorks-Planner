<template>
  <BasePage
    :title="blok.title"
    :subtitle="blok.subtitle"
    :img="blok.preview.filename"
    v-editable="blok"
  >
    <template v-if="blok.abstract">
      <h5 class="text-h5" v-html="createHtml(blok.abstract)"></h5>
      <v-divider class="margin-bottom-large margin-top-large" />
    </template>
    <div v-html="createHtml(blok.content)" class="margin-bottom-large"></div>
    <iframe
      v-if="blok.youtubeUrl.url"
      width="100%"
      height="500"
      :src="blok.youtubeUrl.url"
      frameborder="0"
    ></iframe>
    <v-divider />
    <v-row class="margin-top-large margin-bottom-large">
      <v-card :width="cardWidth" class="ma-2">
        <v-card-title>
          <div>Get Started Today</div>
        </v-card-title>
        <v-card-text class="info-description">
          <div>Visualize your location data in an interactive map. Upload an excel or csv file with addresses or latitude and longitudes to get started.</div>
        </v-card-text>
        <v-card-actions class="card-actions">
          <UploadWorkflow color="primary" @finish="finish" />
        </v-card-actions>
      </v-card>
      <v-card :width="cardWidth" class="ma-2">
        <v-card-title>
          <div>Try an Example Dataset</div>
        </v-card-title>
        <v-card-text class="info-description">
          <div>We offer numerous example datasets to help you understand the tool before using your own data.</div>
        </v-card-text>
        <v-card-actions class="card-actions">
          <v-btn text @click="previewExamples">Preview</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-divider />
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import StoryblokClient from "storyblok-js-client";
import Footer from "@/components/Home/Footer/Footer.vue";
import FeatureI from "@/entities/storyblok/Feature";
import BasePage from "@/components/Shared/Page/Page.vue";
import UploadWorkflow from "@/components/UploadWorkflow/UploadWorkflow.vue";
import UploadedFile from "@/entities/UploadedFile";

const Storyblok = new StoryblokClient({
  accessToken: process.env.VUE_APP_STORYBLOK_TOKEN,
});

/**
 * Storyblok feature component
 */
@Component({
  components: {
    BasePage,
    Footer,
    UploadWorkflow,
  },
})
export default class Feature extends Vue {
  /**
   * All of the content for this feature
   */
  @Prop()
  private blok!: FeatureI;

  private get cardWidth() {
    if (this.$vuetify.breakpoint.name === "xs") {
      return "100%";
    }
    return "calc(50% - 20px)";
  }

  private createHtml(richText: object) {
    return Storyblok.richTextResolver.render(richText);
  }

  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
  }

  private previewExamples() {
    /**
     * Open the examples section
     */
    this.$emit("previewExamples");
  }
}
</script>
<style lang="scss" scoped>
.info-description {
  margin-bottom: 42px;
}
.card-actions {
  position: absolute;
  bottom: 8px;
  right: 0px;
}
</style>