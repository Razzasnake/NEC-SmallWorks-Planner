<template>
  <InfoSection :title="title" :description="description" :cards="cards">
    <template slot="extra">
      <Preview />
    </template>
  </InfoSection>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import InfoSection from "../InfoSection/InfoSection.vue";
import Preview from "@/components/Home/Preview/Preview.vue";

/**
 * Display the features that are currently available
 */
@Component({
  components: {
    InfoSection,
    Preview,
  },
})
export default class Features extends Vue {
  private title: string = "No Work. Just Insight.";
  private description: string =
    "Visualize your location data like never before.";
  private cards = [
    {
      title: "Unlimited Geocoding",
      description:
        "Visualize your location data without a latitude or longitude. Just select the location columns and we take care of the rest.",
      learnMorePath: "/features/unlimited-geocoding",
    },
    {
      title: "Automation",
      description:
        "We automate everything to give you a quick glimpse of your data without the tedious setup.",
      learnMorePath: "/features/automation",
    },
    {
      title: "Filterable",
      description:
        "Draw shapes on the map or apply filters to the table and see your data update instantly.",
      learnMorePath: "/features/filterable",
    },
  ];
}
</script>