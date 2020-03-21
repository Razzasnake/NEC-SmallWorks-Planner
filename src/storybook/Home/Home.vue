<template>
  <div class="content">
    <TableAndMap
      v-if="uploadedFile"
      class="content__table-and-map"
      :uploadedFile="uploadedFile"
      :filters="filters"
      :sorting="sorting"
      :map="map"
      :tableLogic="tableLogic"
      @updateOverlayEventJsons="updateOverlayEventJsons"
      @rowSelectionsChanged="rowSelectionsChanged"
      @sortChanged="sortChanged"
      @filterChanged="filterChanged"
    ></TableAndMap>
    <UploadWorkflow v-else @finish="finish"></UploadWorkflow>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/storybook/Views/TableAndMap/TableAndMap.vue";
import UploadWorkflow from "@/storybook/UploadWorkflow/UploadWorkflow.vue";
import UploadedFile from "@/entities/UploadedFile";
import TableLogic from "@/storybook/Views/TableAndMap/TableLogic";

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
  private filters: { [colId: string]: any } = {};
  private sorting: { colId: string; sort: string }[] = [];
  private map = {
    summary: [],
    overlayEventJsons: [],
    infoWindowKeys: [],
    allowDraw: true
  };
  private tableLogic: TableLogic | null = null;

  private finish(uploadedFile: UploadedFile) {
    this.tableLogic = new TableLogic(uploadedFile);
    this.uploadedFile = uploadedFile;
  }

  private updateOverlayEventJsons() {}

  private rowSelectionsChanged() {}

  private sortChanged() {}

  private filterChanged() {}
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