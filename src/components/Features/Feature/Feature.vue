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
import Automation from "./Content/Automation.vue";
import GeoJSONandShapefileLayers from "./Content/GeoJSONandShapefileLayers.vue";
import MapYourLocationData from "./Content/MapYourLocationData.vue";
import CategoricalGrouping from "./Content/CategoricalGrouping.vue";
import HeatMapLayer from "./Content/HeatMapLayer.vue";
import SupportsManyMarkers from "./Content/SupportsManyMarkers.vue";
import Filterable from "./Content/Filterable.vue";
import HelpfulTableFooters from "./Content/HelpfulTableFooters.vue";
import UnlimitedGeocoding from "./Content/UnlimitedGeocoding.vue";

/**
 * Feature component with content
 */
@Component({
  name: "FeaturesFeature",
  components: {
    BasePage,
    Automation,
    GeoJSONandShapefileLayers,
    MapYourLocationData,
    CategoricalGrouping,
    HeatMapLayer,
    SupportsManyMarkers,
    Filterable,
    HelpfulTableFooters,
    UnlimitedGeocoding,
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
