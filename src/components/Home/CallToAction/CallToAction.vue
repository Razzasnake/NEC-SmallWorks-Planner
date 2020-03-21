<template>
  <div class="card call-to-action">
    <div class="card-content">
      <p class="title">Table &amp; Map</p>
      <p class="subtitle">View and interact with your geographical data on a map and in a table.</p>
      <UploadWorkflow class="upload-workflow" @finish="finish"></UploadWorkflow>
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
.call-to-action {
  height: 300px;
  width: 600px;
  .upload-workflow {
    display: flex;
    justify-content: center;
  }
}
</style>