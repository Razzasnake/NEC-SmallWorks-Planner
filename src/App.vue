<template>
  <div id="app">
    <NavBar
      :inAnalysis="inAnalysis"
      :viewOptions="viewOptions"
      @jumpTo="jumpTo"
      @updateSettings="updateSettings"
      @updateViewOptions="updateViewOptions"
    ></NavBar>
    <SignInSignOut />
    <SignUp />
    <template>
      <router-view></router-view>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { refreshAuthenticated } from "@/store/userStore";
import NavBar from "@/components/NavBar/NavBar.vue";
import SignInSignOut from "@/components/NavBar/Options/SignInSignOut/SignInSignOut.vue";
import SignUp from "@/components/NavBar/Options/SignUp/SignUp.vue";
import state, {
  updateViewOptions,
  updateSettingsVisible,
  reset
} from "@/store/exploreStore";

/**
 * Root of project
 */
@Component({
  components: {
    NavBar,
    SignInSignOut,
    SignUp
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

  private jumpTo(location: { name: string }) {
    reset();
    if (location.name !== this.$route.name) {
      this.$router.push(location);
    }
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
  background-color: #fafafa;
  height: calc(100vh - 52px);
}
</style>
