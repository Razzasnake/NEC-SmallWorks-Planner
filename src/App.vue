<template>
  <div id="app">
    <NavBar></NavBar>
    <img alt="Vue logo" :src='require("@/assets/logo.png")'>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import NavBar from '@/storybook/NavBar/NavBar.vue'

@Component({
  components: {
    NavBar
  }
})
export default class App extends Vue {
}
</script>
<style lang="scss" scoped>

</style>
