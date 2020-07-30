<template>
  <div>
    <div class="content section">
      <CallToAction @finish="$emit('finish', $event)"></CallToAction>
    </div>
    <div class="content section">
      <Features />
    </div>
    <div class="content section">
      <ComingSoon />
    </div>
    <div class="content">
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

/**
 * Root most component for the home page
 */
@Component({
  components: {
    CallToAction,
    Features,
    ComingSoon,
    Footer
  }
})
export default class Home extends Vue {}
</script>
<style lang='scss' scoped>
.content {
  &:nth-of-type(even) {
    background-color: #eeeeee;
  }
  &:nth-of-type(odd) {
    background-color: #fafafa;
  }
}
</style>