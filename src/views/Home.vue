<template>
  <div class="home-view">
    <HomeComponent style="height: 100%;"></HomeComponent>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import HomeComponent from "@/components/Home.vue";

@Component({
  components: {
    HomeComponent
  }
})
export default class HomeView extends Vue {}
</script>
<style lang="scss" scoped>
.home-view {
  height: calc(100vh - 52px);
}
</style>
