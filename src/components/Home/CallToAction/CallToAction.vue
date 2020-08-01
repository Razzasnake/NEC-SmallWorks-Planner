<template>
  <div>
    <div class="margin-bottom-large">
      <div class="text-h2">Table &amp; Map</div>
      <div class="text-h6">{{ tagline }}</div>
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
    UploadWorkflow,
  },
})
export default class CallToAction extends Vue {
  private tagline =
    "View locational data in an interactive map. Upload an excel or csv file to get started.";
  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>