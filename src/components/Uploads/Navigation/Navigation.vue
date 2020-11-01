<template>
  <UploadWorkflow
    small
    @finish="finish"
  />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import UploadWorkflow from "@/components/UploadWorkflow/UploadWorkflow.vue";
import UploadedFile from "@/entities/UploadedFile";

/**
 * Uploads section where a user can manage their documents
 */
@Component({
  name: "UploadsNavigation",
  components: {
    UploadWorkflow,
  },
})
export default class Navigation extends Vue {
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