<template>
  <div class="explore">
    <TableAndMap
      v-if="uploadedFile && googleMapsLibrary"
      :uploaded-file="uploadedFile"
      :filters="filters"
      :sorting="sorting"
      :overlay-event-jsons="overlayEventJsons"
      :table-logic="tableLogic"
      @update-overlay-event-jsons="updateOverlayEventJsons"
      @sort-changed="updateSorting"
      @filter-changed="updateFilters"
    />
    <Loading
      v-else
      loading
    />
    <v-dialog
      v-model="areYouSureModal"
      max-width="400"
      @click:outside="cancelLeave"
    >
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to leave?
        </v-card-title>
        <v-card-text>You will lose all uploaded markers, shapefiles, drawn shapes, filters, and sortings. Click <b>"Sign in"</b> to save your data to Google Drive.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="cancelLeave"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="confirmLeave"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import TableAndMap from "@/components/TableAndMap/TableAndMap.vue";
import UploadedFile from "@/entities/UploadedFile";
import TableLogic from "@/components/TableAndMap/Table/Logic/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import state, {
  reset,
  updateOverlayEventJsons,
  updateFilters,
  updateSorting,
  updateUploadedFile
} from "@/store/exploreStore";
import Loading from "@/components/Shared/Loading/Loading.vue";
import _View from "./_View";
import GoogleMapUtils from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import { Route, NavigationGuardNext } from "vue-router";
import driveState from "@/store/driveStore";
import { examples } from "@/entities/data";
import exampleApi from "@/api/example";

Component.registerHooks(["beforeRouteLeave"]);

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
  private areYouSureModal = false;
  private pathToLeaveTo: { name: string } | null = null;

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
    examples.forEach(async example => {
      const slug = example.title.toLowerCase().replaceAll(" ", "-");
      if (slug === this.fileId) {
        updateUploadedFile(await exampleApi.getExample(example));
      }
    });
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

  private beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
    if (to.name !== this.$route.name) {
      if (
        this.$route.name === "Explore" &&
        !driveState.user &&
        state.uploadedFile &&
        state.uploadedFile.toUpload
      ) {
        this.areYouSureModal = true;
        this.pathToLeaveTo = { name: to.name! };
        next(false);
      } else {
        reset();
        next();
      }
    }
  }

  private confirmLeave() {
    if (this.pathToLeaveTo) {
      reset();
      this.$router.push(this.pathToLeaveTo);
    }
    this.cancelLeave();
  }

  private cancelLeave() {
    this.areYouSureModal = false;
    this.pathToLeaveTo = null;
  }
}
</script>
<style lang='scss' scoped>
.explore {
  height: calc(100vh - 52px);
}
</style>