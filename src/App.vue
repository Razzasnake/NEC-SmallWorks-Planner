<template>
  <div id="app">
    <NavBar @jumpTo="jumpTo"></NavBar>
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
import { reset } from "@/store/exploreStore";

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
  @Watch("$route")
  private async routeChanged() {
    refreshAuthenticated();
  }

  private created() {
    this.routeChanged();
  }

  private jumpTo(location: { name: string }) {
    if (location.name !== this.$route.name) {
      if (this.$route.name === "Explore") {
        this.$buefy.dialog.confirm({
          message: "Are you sure you want to leave?",
          confirmText: "Yes",
          onConfirm: () => {
            this.$router.push(location);
            reset();
          }
        });
      } else {
        this.$router.push(location);
      }
    }
  }
}
</script>
<style lang='scss' scoped>
#app {
  background-color: #fafafa;
  height: calc(100vh - 52px);
}
</style>
