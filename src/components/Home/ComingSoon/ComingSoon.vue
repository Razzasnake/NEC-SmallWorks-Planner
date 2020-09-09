<template>
  <InfoSection :title="title" :description="description" :cards="cards" />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import InfoSection from "../InfoSection/InfoSection.vue";

/**
 * Display the features that are coming soon.
 */
@Component({
  components: {
    InfoSection,
  },
})
export default class ComingSoon extends Vue {
  private title: string = "Coming Soon";
  private description: string =
    "Table & Map is in beta and new features are being released every week.";
  private cards = [
    {
      title: "User Accounts",
      description:
        "Upload your datasets once and see them in the tool each time you log in.",
    },
    {
      title: "Public Links",
      description: "Share your dataset with friends and coworkers.",
    },
    {
      title: "Embeddable",
      description: "Embed our tool on your website for your users to enjoy.",
    },
  ];
}
</script>