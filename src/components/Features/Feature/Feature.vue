<template>
  <BasePage
    :title="feature.title"
    :subtitle="feature.description"
    :img="feature.preview.filename"
    @finish="finish"
  >
    <component :is="Content" />
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import BasePage from "@/components/Shared/Page/Page.vue";
import UploadedFile from "@/entities/UploadedFile";
import TeaserI from '@/entities/Teaser';

/**
 * Feature component with content
 */
@Component({
  components: {
    BasePage,
    Automation: () => import("./Content/Automation.vue"),
    GeoJSONandShapefileLayers: () => import("./Content/GeoJSONandShapefileLayers.vue"),
    MapYourLocationData: () => import("./Content/MapYourLocationData.vue"),
    CategoricalGrouping: () => import("./Content/CategoricalGrouping.vue"),
    HeatMapLayer: () => import("./Content/HeatMapLayer.vue"),
    SupportsManyMarkers: () => import("./Content/SupportsManyMarkers.vue"),
    Filterable: () => import("./Content/Filterable.vue"),
    HelpfulTableFooters: () => import("./Content/HelpfulTableFooters.vue"),
    UnlimitedGeocoding: () => import("./Content/UnlimitedGeocoding.vue"),
  },
})
export default class Feature extends Vue {
  /**
   * Teaser content for this feature
   */
  @Prop()
  private feature!: TeaserI;

  private get Content() {
    return `${this.feature.title.replaceAll(" ", "")}`;
  }

  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     *
     * @type {UploadedFile}
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>