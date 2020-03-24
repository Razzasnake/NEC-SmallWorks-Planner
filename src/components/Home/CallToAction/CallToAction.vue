<template>
  <div style="text-align: center;">
    <div class="title">Table &amp; Map</div>
    <div class="subtitle">View data in an interactive map. Upload an excel/csv file and see for yourself!</div>
    <div style="display: flex; justify-content: center;">
      <UploadWorkflow @finish="finish"></UploadWorkflow>
    </div>
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
  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang='scss' scoped>
</style>