<template>
  <div id="app">
    <v-app>
      <NavBar :drawer-allowed="drawerAllowed" />
      <v-main>
        <keep-alive>
          <router-view />
        </keep-alive>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "@/components/NavBar/NavBar.vue";
import state from "@/store/exploreStore";

/**
 * Root of project
 */
@Component({
  name: "App",
  components: {
    NavBar,
  },
})
export default class App extends Vue {
  private get drawerAllowed() {
    return state.uploadedFile !== null && this.$route.name === "Explore";
  }
}
</script>
<style lang='scss' scoped>
#app {
  background-color: #fafafa;
  color: #424242;
}
</style>
