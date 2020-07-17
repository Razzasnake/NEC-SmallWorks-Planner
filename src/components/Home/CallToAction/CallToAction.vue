<template>
  <div class="call-to-action" id="upload-drop-area">
    <div class="align-center margin-bottom-large">
      <div class="text-h4">Table &amp; Map</div>
      <div class="text-subtitle-1">{{ tagline }}</div>
    </div>
    <UploadWorkflow @finish="finish"></UploadWorkflow>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadWorkflow from "@/components/UploadWorkflow/UploadWorkflow.vue";
import UploadedFile from "@/entities/UploadedFile";

/**
 * Get someone to upload a file.
 */
@Component({
  components: {
    UploadWorkflow
  }
})
export default class CallToAction extends Vue {
  private tagline =
    "View locational data in an interactive map. Upload an excel or csv file and see for yourself!";
  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang='scss' scoped>
.call-to-action {
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#upload-drop-area {
  border: 1px solid transparent;
  &.highlight {
    background-color: mix(white, #10546A, 95%);
    border: 1px dashed #10546A;
    border-radius: 4px;
  }
}
</style>