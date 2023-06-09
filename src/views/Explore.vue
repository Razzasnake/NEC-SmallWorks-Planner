<template>
  <div :class="exploreOrEmbed">
    <TableAndMap
      v-if="uploadedFile && googleMapsLibrary"
      :uploaded-file="uploadedFile"
      :filters="filters"
      :sorting="sorting"
      :overlay-event-jsons="overlayEventJsons"
      :table-logic="tableLogic"
      :view-options="viewOptions"
      :layers="layers"
      :is-paid-tier="isPaidTier"
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
        <v-card-text>
          You will lose all uploaded markers, shapefiles, drawn shapes, filters,
          and sortings. Click <b>"Sign in"</b> to save your data to Google
          Drive.
        </v-card-text>
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
import { Component, Prop, Watch } from "vue-property-decorator";
import TableAndMap from "@/components/TableAndMap/TableAndMap.vue";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import state, {
  reset,
  updateOverlayEventJsons,
  updateFilters,
  updateSorting,
  updateUploadedFile,
} from "@/store/exploreStore";
import Loading from "@/components/Shared/Loading/Loading.vue";
import _View from "./_View";
import GoogleMapUtils from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import { Route, NavigationGuardNext } from "vue-router";
import driveState, { directLinkDownloadData } from "@/store/driveStore";
import { examples } from "@/entities/data";
import exampleApi from "@/api/example";

Component.registerHooks(["beforeRouteLeave"]);

declare const $crisp: any;

/**
 * Explore the data that was just uploaded
 */
@Component({
  name: "ViewsExplore",
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

  private get viewOptions() {
    return state.viewOptions;
  }

  private get layers() {
    return state.layers;
  }

  private get uploadedFileName() {
    if (state.uploadedFile) {
      return state.uploadedFile.fileName;
    }
    return "";
  }

  private get exploreOrEmbed() {
    return this.$route.name === "Explore" ? "explore" : "embed";
  }

  private get isPaidTier() {
    return driveState.tier === 1;
  }

  @Watch("uploadedFileName")
  private uploadedFileNameChanged() {
    if (state.uploadedFile) {
      super.activated({
        title: `${
          state.uploadedFile.fileName.split(".").slice(0, -2).join(".") ||
          state.uploadedFile.fileName
        } - Table & Map`,
      });
    }
  }

  protected activated() {
    this.embedSetup();
    examples.forEach(async (example) => {
      const slug = example.title.toLowerCase().split(" ").join("-");
      if (slug === this.fileId) {
        updateUploadedFile(await exampleApi.getExample(example), true);
        super.activated({
          title: `${example.title} - Table & Map`,
          content: example.description,
        });
      }
    });
    if (this.fileId === null && state.uploadedFile === null) {
      this.$router.push({ name: "Home" });
    } else if (state.uploadedFile) {
      this.uploadedFileNameChanged();
    } else if (this.fileId && driveState.files.length) {
      directLinkDownloadData();
    }
  }

  private embedSetup() {
    if ($crisp && this.$route.name === "Embed") {
      $crisp.push(["do", "chat:hide"]);
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.onload = () => {
        directLinkDownloadData();
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    }
  }

  private created() {
    GoogleMapUtils.injectGoogleMapsLibrary().then(() => {
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
.embed {
  height: 100vh;
}
</style>