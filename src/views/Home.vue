<template>
  <div class="columns home">
    <div class="column actions">
      <CallToAction @finish="finish"></CallToAction>
      <div class="view-examples">
        <a @click="viewExamples">View Examples</a>
      </div>
    </div>
    <div class="column is-three-quarters">
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
  width: 100%;
  max-width: 1536px;
  margin: auto;
  height: 100%;
  align-items: center;
}
.view-examples {
  margin-top: 8px;
}
.preview {
  max-height: 60vh;
}
</style>