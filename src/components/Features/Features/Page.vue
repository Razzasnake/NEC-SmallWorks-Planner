<template>
  <div v-editable="blok">
    <template v-for="item in blok.body">
      <component :key="item._uid" :blok="item" :is="item.component"></component>
    </template>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Teaser from "./Teaser.vue";

/**
 * Storyblok page component
 */
@Component({
  components: {
    Teaser
  },
})
export default class Page extends Vue {
  @Prop()
  private blok: any;
}
</script>
<style lang='scss' scoped>
</style>