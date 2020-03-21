<template>
  <Home class="home-view"></Home>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Home from "@/components/Home/Home.vue";

@Component({
  components: {
    Home
  }
})
export default class HomeView extends Vue {}
</script>
<style lang="scss" scoped>
.home-view {
  height: 100vh;
}
</style>
