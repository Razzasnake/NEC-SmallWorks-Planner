<template>
  <div class="content">
    <TableAndMap class="content__table-and-map" v-if="uploadedFile" :uploadedFile="uploadedFile"></TableAndMap>
    <UploadWorkflow v-else @finish="finish"></UploadWorkflow>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/storybook/Views/TableAndMap/TableAndMap.vue";
import UploadWorkflow from "@/storybook/UploadWorkflow/UploadWorkflow.vue";
import UploadedFile from "@/entities/UploadedFile";

/**
 * Contain content about what TableAndMap what it does
 */
@Component({
  components: {
    UploadWorkflow,
    TableAndMap
  }
})
export default class Home extends Vue {
  private uploadedFile: UploadedFile | null = null;

  private finish(uploadedFile: UploadedFile) {
    this.uploadedFile = uploadedFile;
  }
}
</script>
<style lang='scss' scoped>
.content {
  height: 100%;
  .content__table-and-map {
    height: 100%;
  }
}
</style>