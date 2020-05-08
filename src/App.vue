<template>
  <div id="app">
    <NavBar
      :inAnalysis="inAnalysis"
      :viewOptions="viewOptions"
      @jumpTo="jumpTo"
      @updateSettings="updateSettings"
      @updateViewOptions="updateViewOptions"
    ></NavBar>
    <template>
      <router-view
        :style="backgroundStyle"
      ></router-view>
    </template>
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
  private backgroundStyle = `
    background-image: url(${require('@/assets/background.svg')});
    min-height: 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;`

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
#app {
  height: calc(100vh - 52px);
}
</style>
