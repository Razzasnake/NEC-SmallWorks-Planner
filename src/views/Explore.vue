<template>
  <div class="explore">
    <TableAndMap
      v-if="uploadedFile && googleMapsLibrary"
      :uploaded-file="uploadedFile"
      :filters="filters"
      :sorting="sorting"
      :overlay-event-jsons="overlayEventJsons"
      :table-logic="tableLogic"
      @updateOverlayEventJsons="updateOverlayEventJsons"
      @sortChanged="updateSorting"
      @filterChanged="updateFilters"
    />
    <Loading
      v-else
      loading
    />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/components/TableAndMap/TableAndMap.vue";
import UploadedFile from "@/entities/UploadedFile";
import TableLogic from "@/components/TableAndMap/Table/Logic/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import state, {
  updateOverlayEventJsons,
  updateFilters,
  updateSorting,
} from "@/store/exploreStore";
import Loading from "@/components/Shared/Loading/Loading.vue";
import _View from "./_View";
import GoogleMapUtils from "@/components/TableAndMap/GoogleMap/Logic/Utils";

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
  private googleMapsLibrary: boolean = false;

  private get uploadedFile() {
    return state.uploadedFile;
  }

  private get filters() {
    return state.filters;
  }

  private get sorting() {
    return state.sorting;
  }

  private get overlayEventJsons() {
    return state.overlayEventJsons;
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

  private created() {
    GoogleMapUtils.injectGoogleMapsLibrary([
      "drawing",
      "visualization",
      "geometry",
    ]).then(() => {
      this.googleMapsLibrary = true;
    });
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