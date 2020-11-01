<template>
  <BasePage
    title="Features"
    subtitle="Learn more about how Table & Map helps you understand your location data."
    :img="require('@/assets/mapwithmarkers.jpg')"
    @finish="finish"
  >
    <v-row justify="center">
      <Teaser
        v-for="feature in features"
        :key="feature.feature.url"
        :teaser="feature"
        button-text="Learn More"
        class="ma-2"
      />
    </v-row>
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";
import BasePage from "@/components/Shared/Page/Page.vue";
import UploadedFile from "@/entities/UploadedFile";
import { features } from "@/entities/data";

/**
 * Features page component
 */
@Component({
  name: "FeaturesPage",
  components: {
    Teaser,
    BasePage,
  },
})
export default class Page extends Vue {
  private features = features;

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