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
  updateUploadedFile,
} from "@/store/exploreStore";

/**
 * Explore the data that was just uploaded
 */
@Component({
  components: {
    TableAndMap,
  },
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

  private activated() {
    document.title = "Table & Map - Explore";
    const description = document.getElementsByName("description");
    if (description.length) {
      (description[0] as HTMLMetaElement).content =
        "Visualize your locational data in an interactive map. Upload an excel or csv file to get started.";
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
.explore {
  height: calc(100vh - 52px);
}
</style>