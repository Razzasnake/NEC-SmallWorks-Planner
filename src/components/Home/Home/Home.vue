<template>
  <div>
    <v-img
      class="image-header"
      src="https://a.storyblok.com/f/89733/2546x1252/200e33e9cf/app.jpg"
      gradient="to top, rgba(38, 50, 56, .80), rgba(38, 50, 56, .80)"
    >
      <div id="upload-drop-area">
        <CallToAction class="section-header section" @finish="$emit('finish', $event)"></CallToAction>
      </div>
    </v-img>
    <div class="section">
      <Features />
    </div>
    <div class="section" style="background-color: #ECEFF1">
      <div
        class="text-h4 align-center"
        style="max-width: 800px; margin: auto;"
      >Over 10,000 companies rely on Table & Map to find insight in their location data</div>
    </div>
    <v-img
      class="section image-footer align-center"
      gradient="to top, rgba(38, 50, 56, .80), rgba(38, 50, 56, .80)"
      src="https://a.storyblok.com/f/89733/2000x400/c4eaec5cab/mapwithmarkers.jpg"
    >
      <CallToAction class="section-header section slot" @finish="$emit('finish', $event)">
        <div class="margin-bottom-large">
          <h3 class="text-h3">Visualize Your Location Data</h3>
        </div>
      </CallToAction>
    </v-img>
    <div class="section">
      <Footer />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import UploadedFile from "@/entities/UploadedFile";
import CallToAction from "@/components/Home/CallToAction/CallToAction.vue";
import Features from "@/components/Home/Features/Features.vue";
import Footer from "@/components/Home/Footer/Footer.vue";

/**
 * Root most component for the home page
 */
@Component({
  components: {
    CallToAction,
    Features,
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
  width: 100%;
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
}
.image-footer {
  display: flex;
  align-items: center;
  height: 250px;
  width: 100%;
  div {
    color: #eeeeee;
    margin: auto;
    width: 1215px;
  }
}

#upload-drop-area {
  margin: auto;
  display: flex;
  justify-content: center;
  border: 2px solid transparent;
  height: calc(100vh - 88px);
  width: calc(100vw - 40px);

  &.highlight {
    border: 2px dashed #eeeeee;
    border-radius: 4px;
  }
  .scroll-down {
    color: #eeeeee;
    position: absolute;
    bottom: 40px;
    border: 1px solid #eeeeee;
  }
}
</style>