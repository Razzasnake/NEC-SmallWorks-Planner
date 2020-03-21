<template>
  <div class="content" :style="`background: url(${require('@/assets/background.jpg')}) center;`">
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
    <div v-else class="begin">
      <CallToAction @finish="finish"></CallToAction>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/storybook/Views/TableAndMap/TableAndMap.vue";
import CallToAction from "./CallToAction/CallToAction.vue";
import UploadedFile from "@/entities/UploadedFile";
import TableLogic from "@/storybook/Views/TableAndMap/TableLogic";
import { OverlayJson } from "../Views/TableAndMap/GoogleMap/Utils";
import { TableAndMapMap } from "../Views/TableAndMap/Types";

/**
 * Contain content about what TableAndMap what it does
 */
@Component({
  components: {
    CallToAction,
    TableAndMap
  }
})
export default class Home extends Vue {
  private uploadedFile: UploadedFile | null = null;
  private filters: { [colId: string]: any } = {};
  private sorting: { colId: string; sort: string }[] = [];
  private map: TableAndMapMap = {
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

  private updateOverlayEventJsons(overlayEventJsons: OverlayJson[]) {
    this.map.overlayEventJsons = overlayEventJsons;
  }

  private rowSelectionsChanged(rowIds: string[]) {
    if (this.uploadedFile) {
      const rowIdsSet = new Set(rowIds);
      this.uploadedFile.data.forEach(row => {
        row.isSelected = rowIdsSet.has(row.id);
      });
    }
  }

  private sortChanged(sorting: { colId: string; sort: string }[]) {
    this.sorting = sorting;
  }

  private filterChanged(filters: { [colId: string]: any }) {
    this.filters = filters;
  }
}
</script>
<style lang='scss' scoped>
.content {
  height: 100%;
  background-size: cover;
  .begin {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content__table-and-map {
    height: 100%;
  }
}
</style>