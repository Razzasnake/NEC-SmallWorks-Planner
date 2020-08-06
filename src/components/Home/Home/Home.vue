<template>
  <div>
    <v-img
      class="image-header"
      src="https://a.storyblok.com/f/89733/2545x1253/653593bd7d/app.jpg"
      gradient="to top, rgba(38, 50, 56, .75), rgba(38, 50, 56, .75)"
    >
      <div id="upload-drop-area">
        <CallToAction class="section-header section" @finish="$emit('finish', $event)"></CallToAction>
        <v-btn icon fab @click="scrollDown" small class="scroll-down" aria-label="Scroll down">
          <v-icon large>{{ mdiChevronDown }}</v-icon>
        </v-btn>
      </div>
    </v-img>
    <div class="section">
      <Features />
    </div>
    <div class="section">
      <ComingSoon />
    </div>
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
import ComingSoon from "@/components/Home/ComingSoon/ComingSoon.vue";
import Footer from "@/components/Home/Footer/Footer.vue";
import { mdiChevronDown } from "@mdi/js";

/**
 * Root most component for the home page
 */
@Component({
  components: {
    CallToAction,
    Features,
    ComingSoon,
    Footer,
  },
})
export default class Home extends Vue {

  private mdiChevronDown = mdiChevronDown;

  private scrollDown() {
    window.scroll({
      top: window.innerHeight - 48,
      left: 0,
      behavior: "smooth",
    });
  }
}
</script>
<style lang='scss' scoped>
.image-header {
  display: flex;
  align-items: center;
  height: calc(100vh - 48px);
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