<template>
  <div class="explore">
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
    <Loading loading v-else />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/components/TableAndMap/TableAndMap.vue";
import UploadedFile from "@/entities/UploadedFile";
import TableLogic from "@/components/TableAndMap/Table/Logic/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import { TableAndMapMap } from "@/components/TableAndMap/Types";
import state, {
  updateOverlayEventJsons,
  updateFilters,
  updateSorting,
} from "@/store/exploreStore";
import Loading from "@/components/Shared/Loading/Loading.vue";
import _View from "./_View";

/**
 * Explore the data that was just uploaded
 */
@Component({
  components: {
    Loading,
    TableAndMap,
  },
})
export default class Explore extends _View {
  /**
   * id of the google file requested
   */
  @Prop({ default: null })
  private fileId!: string | null;

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

  protected activated() {
    if (this.fileId === null && state.uploadedFile === null) {
      this.$router.push({ name: "Home" });
    }
    super.activated({ title: "Table & Map - Explore" });
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
.explore {
  height: calc(100vh - 52px);
}
</style>