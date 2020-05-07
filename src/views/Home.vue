<template>
  <Home class="home-view"></Home>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Home from "@/components/Home/Home.vue";
import { refreshAuthenticated } from "@/store/userStore";

@Component({
  components: {
    Home
  }
})
export default class HomeView extends Vue {
  @Watch("$route")
  private async routeChanged() {
    refreshAuthenticated();
  }
  private created() {
    this.routeChanged();
  }
}
</script>
<style lang="scss" scoped>
.home-view {
  height: calc(100vh - 52px);
}
</style>
