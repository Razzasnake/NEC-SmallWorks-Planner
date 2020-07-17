<template>
  <div id="app">
    <NavBar @jumpTo="jumpTo"></NavBar>
    <template>
      <v-app>
        <v-main>
          <v-container>
            <router-view></router-view>
          </v-container>
        </v-main>
      </v-app>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import NavBar from "@/components/NavBar/NavBar.vue";
import { reset } from "@/store/exploreStore";

/**
 * Root of project
 */
@Component({
  components: {
    NavBar
  }
})
export default class App extends Vue {
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
}
</style>
