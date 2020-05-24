<template>
  <div class="full-height">
    <TableAndMap
      v-if="uploadedFile"
      :uploadedFile="uploadedFile"
      :filters="filters"
      :sorting="sorting"
      :map="map"
      :tableLogic="tableLogic"
      @updateOverlayEventJsons="updateOverlayEventJsons"
      @sortChanged="updateSorting"
      @filterChanged="updateFilters"
    ></TableAndMap>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/components/TableAndMap/TableAndMap.vue";
import UploadedFile from "@/entities/UploadedFile";
import TableLogic from "@/components/TableAndMap/Table/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Utils";
import { TableAndMapMap } from "@/components/TableAndMap/Types";
import state, {
  updateOverlayEventJsons,
  updateFilters,
  updateSorting,
  updateUploadedFile
} from "@/store/exploreStore";

/**
 * Explore the data that was just uploaded
 */
@Component({
  components: {
    TableAndMap
  }
})
export default class Explore extends Vue {
  private get uploadedFile() {
    return state.uploadedFile;
  }

  private get filters() {
    return state.filters;
  }

  private get sorting() {
    return state.sorting;
  }

  private get map() {
    return state.map;
  }

  private get tableLogic() {
    return state.tableLogic;
  }

  private created() {
    if (this.uploadedFile === null) {
      this.$router.push({ name: "Home" });
    }
  }

  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }

  private updateOverlayEventJsons(overlayEventJsons: OverlayJson[]) {
    updateOverlayEventJsons(overlayEventJsons);
  }

  private updateSorting(sorting: { colId: string; sort: string }[]) {
    updateSorting(sorting);
  }

  private updateFilters(filters: { [colId: string]: any }) {
    updateFilters(filters);
  }
}
</script>
<style lang='scss' scoped>
.full-height {
  height: 100%;
}
</style>