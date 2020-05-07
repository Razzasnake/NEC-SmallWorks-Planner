<template>
  <div id="app">
    <NavBar
      :inAnalysis="inAnalysis"
      :viewOptions="viewOptions"
      @jumpTo="jumpTo"
      @updateSettings="updateSettings"
      @updateViewOptions="updateViewOptions"
    ></NavBar>
    <div class="root">
      <router-view
        :style="`background: url(${require('@/assets/background.svg')}) center; height: 100%;`"
      ></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { refreshAuthenticated } from "@/store/userStore";
import NavBar from "@/components/NavBar/NavBar.vue";
import state, {
  updateViewOptions,
  updateSettingsVisible,
  reset
} from "@/store/exploreStore";
import { RawLocation } from "vue-router";

@Component({
  components: {
    NavBar
  }
})
export default class App extends Vue {
  private get uploadedFile() {
    return state.uploadedFile;
  }

  private get viewOptions() {
    return state.viewOptions;
  }

  private get inAnalysis(): boolean {
    return this.uploadedFile !== null;
  }

  @Watch("$route")
  private async routeChanged() {
    refreshAuthenticated();
  }

  private created() {
    this.routeChanged();
  }

  private jumpTo(location: RawLocation) {
    reset();
    this.$router.push(location);
  }

  private updateSettings() {
    updateSettingsVisible(true);
  }

  private updateViewOptions(viewOptions: string[]) {
    updateViewOptions(viewOptions);
  }
}
</script>
<style lang="scss" scoped>
.root {
  margin-top: 52px;
  height: calc(100vh - 52px);
}
</style>
