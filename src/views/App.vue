<template>
  <div class="app-view">
    <AppComponent></AppComponent>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import AppComponent from '@/components/App.vue'

@Component({
  components: {
    AppComponent
  }
})
export default class AppView extends Vue {
}
</script>
<style lang="scss" scoped>

</style>
