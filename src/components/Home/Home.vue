<template>
  <div class="all">
    <NavBar :displayUpload="uploadedFile !== null" @finish="finish" @goHome="goHome"></NavBar>
    <div class="content" :style="`background: url(${require('@/assets/background.svg')}) center;`">
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
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/components/TableAndMap/TableAndMap.vue";
import CallToAction from "./CallToAction/CallToAction.vue";
import UploadedFile from "@/entities/UploadedFile";
import TableLogic from "@/components/TableAndMap/TableLogic";
import { OverlayJson } from "../TableAndMap/GoogleMap/Utils";
import { TableAndMapMap } from "../TableAndMap/Types";
import NavBar from "@/components/NavBar/NavBar.vue";

/**
 * Contain content about what TableAndMap what it does
 */
@Component({
  components: {
    NavBar,
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
    this.uploadedFile = uploadedFile;
    this.filterChanged({});
    this.sortChanged([]);
    this.map = {
      summary: [],
      overlayEventJsons: [],
      infoWindowKeys: [],
      allowDraw: true
    };
    this.tableLogic = new TableLogic(uploadedFile);
  }

  private goHome(): void {
    this.uploadedFile = null;
    this.filterChanged({});
    this.sortChanged([]);
    this.map = {
      summary: [],
      overlayEventJsons: [],
      infoWindowKeys: [],
      allowDraw: true
    };
    this.tableLogic = null;
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
.all {
  height: 100%;
  .content {
    height: calc(100% - 52px);
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
}
</style>