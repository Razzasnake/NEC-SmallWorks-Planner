<template>
  <div class="columns home full-height">
    <div class="column actions is-two-fifths">
      <CallToAction @finish="finish"></CallToAction>
      <div class="margin-top-medium">
        <a @click="viewExamples">View Examples</a>
      </div>
    </div>
    <div class="column">
      <Preview class="preview" />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import CallToAction from "@/components/Home/CallToAction/CallToAction.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import Preview from "@/components/Home/Preview/Preview.vue";

/**
 * Home page to display to first visitors
 */
@Component({
  components: {
    CallToAction,
    Preview
  }
})
export default class Home extends Vue {
  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
    this.$router.push({ name: "Explore" });
  }
  private viewExamples() {
    this.$router.push({ name: "Examples" });
  }
}
</script>
<style lang='scss' scoped>
.home {
  width: 80%;
  max-width: 1536px;
  margin: auto;
  align-items: center;
}
.preview {
  max-height: 60vh;
}
</style>