<template>
  <div>
    <v-img
      class="image-header"
      :src="require('@/assets/app2.jpg')"
      gradient="to top, rgba(38, 50, 56, .80), rgba(38, 50, 56, .80)"
    >
      <div id="upload-drop-area">
        <CallToAction
          class="section-header"
          @finish="$emit('finish', $event)"
        />
      </div>
    </v-img>
    <div class="section b">
      <Features class="section-container" />
    </div>
    <div class="section">
      <GoogleDriveIntegration class="section-container" />
    </div>
    <div class="section b">
      <Examples @preview="$emit('preview', $event)" />
    </div>
    <div class="section">
      <h4 class="text-h4 align-center margin-bottom-large">
        Pricing
      </h4>
      <Tiers />
    </div>
    <v-img
      class="image-footer align-center"
      gradient="to top, rgba(38, 50, 56, .80), rgba(38, 50, 56, .80)"
      :src="require('@/assets/mapwithmarkers.jpg')"
    >
      <CallToAction
        class="section-header section"
        @finish="$emit('finish', $event)"
      >
        <div class="margin-bottom-large">
          <h3 class="text-h3">
            Visualize Your Location Data
          </h3>
        </div>
      </CallToAction>
    </v-img>
    <div class="section">
      <Footer class="section-container" />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import UploadedFile from "@/entities/UploadedFile";
import CallToAction from "@/components/Home/CallToAction/CallToAction.vue";
import Features from "@/components/Home/Features/Features.vue";
import Examples from "@/components/Home/Examples/Examples.vue";
import GoogleDriveIntegration from "@/components/Home/GoogleDriveIntegration/GoogleDriveIntegration.vue";
import Footer from "@/components/Home/Footer/Footer.vue";
import Tiers from "@/components/Pricing/Tiers/Tiers.vue";

/**
 * Root most component for the home page
 */
@Component({
  name: "HomeHome",
  components: {
    CallToAction,
    Features,
    Examples,
    Tiers,
    GoogleDriveIntegration,
    Footer,
  },
})
export default class Home extends Vue {}
</script>
<style lang='scss' scoped>
.image-header {
  display: flex;
  align-items: center;
  height: 650px;
}
.image-footer {
  height: 250px;
}
.section.b {
  background-color: #eceff1;
}
.section-container {
  max-width: 1215px;
  margin: auto;
}
.section-header {
  width: 1215px;
  margin: auto;
  color: #eeeeee;
}
@media (max-width: 1215px) {
  .section-header {
    width: 100%;
  }
}
#upload-drop-area {
  margin: auto;
  display: flex;
  justify-content: center;
  border: 2px solid transparent;
  height: 610px;
  width: calc(100vw - 40px);
  &.highlight {
    border: 2px dashed #eeeeee;
    border-radius: 4px;
  }
}
</style>