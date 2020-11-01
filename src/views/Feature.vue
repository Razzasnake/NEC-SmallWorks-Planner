<template>
  <FeatureComponent
    :feature="feature"
    @finish="finish"
  />
</template>
<script lang='ts'>
import { Component, Prop, Watch } from "vue-property-decorator";
import FeatureComponent from "@/components/Features/Feature/Feature.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import { features } from "@/entities/data";
import TeaserI from '@/entities/Teaser';
import _View from "./_View";

/**
 * Feature full content page
 */
@Component({
  name: "ViewsFeature",
  components: {
    FeatureComponent,
  },
})
export default class Feature extends _View {
  /**
   * Slug of the feature
   */
  @Prop()
  private slug!: string;

  private feature: TeaserI | null = null;

  @Watch("slug")
  private slugChanged() {
    this.feature = null;
    const feature = features.find(feature => feature.feature.url === `/features/${this.slug}`);
    if (feature) {
      this.feature = feature;
    } else {
      this.$router.push({ name: "404" });
    }
    this.updateTitleDescription();
  }

  private created() {
    this.slugChanged();
  }

  protected activated() {
    this.updateTitleDescription();
  }

  private updateTitleDescription() {
    if (this.feature) {
      super.activated({
        title: `Table & Map - ${this.feature.title}`,
        content: this.feature.description,
      });
    }
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }
}
</script>