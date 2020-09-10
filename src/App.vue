<template>
  <div id="app">
    <v-app>
      <NavBar :drawerAllowed="drawerAllowed" @jumpTo="jumpTo"></NavBar>
      <v-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <v-dialog v-model="areYouSureModal" max-width="400" @click:outside="cancelLeave">
          <v-card>
            <v-card-title class="headline">Are you sure you want to leave?</v-card-title>
            <v-card-text>{{ areYouSureMessage }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="cancelLeave">Cancel</v-btn>
              <v-btn color="primary" text @click="confirmLeave">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import NavBar from "@/components/NavBar/NavBar.vue";
import state, { reset } from "@/store/exploreStore";
import driveState from "@/store/driveStore";

/**
 * Root of project
 */
@Component({
  components: {
    NavBar,
  },
})
export default class App extends Vue {
  private areYouSureModal = false;
  private pathToLeaveTo: { name: string } | null = null;

  private get drawerAllowed() {
    return state.uploadedFile !== null && this.$route.name === "Explore";
  }

  private get areYouSureMessage() {
    if (driveState.user) {
      return "You will lose all uploaded shapefiles and drawn shapes.";
    } else {
      return 'You will lose all uploaded markers, shapefiles, filters, drawn shapes and sortings. Click "Sign in" to save your data to Google Drive.';
    }
  }

  @Watch("$route")
  private routerUpdated() {
    if (this.$route.name !== "Explore" && state.uploadedFile) {
      reset();
    }
  }

  private created() {
    this.routerUpdated();
  }

  private jumpTo(location: { name: string }) {
    if (location.name !== this.$route.name) {
      if (this.$route.name === "Explore") {
        this.areYouSureModal = true;
        this.pathToLeaveTo = location;
      } else {
        this.$router.push(location);
      }
    }
  }

  private confirmLeave() {
    if (this.pathToLeaveTo) {
      this.$router.push(this.pathToLeaveTo);
    }
    this.cancelLeave();
    reset();
  }

  private cancelLeave() {
    this.areYouSureModal = false;
    this.pathToLeaveTo = null;
  }
}
</script>
<style lang='scss' scoped>
#app {
  background-color: #fafafa;
}
</style>
