<template>
  <div>
    <slot>
      <div class="margin-bottom-large">
        <h2 class="text-h2">
          Table & Map
        </h2>
        <h6 class="text-h6 tagline">
          {{ tagline }}
        </h6>
      </div>
    </slot>
    <UploadWorkflow @finish="finish" />
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
  name: "HomeCallToAction",
  components: {
    UploadWorkflow,
  },
})
export default class CallToAction extends Vue {
  private tagline =
    "Visualize your location data in an interactive map. Upload an excel, csv or json file to get started.";
  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     *
     * @type {UploadedFile}
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang="scss" scoped>
.tagline {
  max-width: 600px;
}
</style>