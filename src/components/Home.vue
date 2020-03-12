<template>
  <div class="home-component">
    <Home></Home>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Home from '@/storybook/Home/Home.vue'

@Component({
  components: {
    Home
  }
})
export default class HomeComponent extends Vue {
}
</script>
<style lang="scss" scoped>

</style>
