<template>
  <div>{{ blok }}</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

/**
 * Storyblok feature component
 */
@Component({
  components: {},
})
export default class Feature extends Vue {
  /**
   * All of the content for this feature
   */
  @Prop()
  private blok: any;
}
</script>
<style lang='scss' scoped>
</style>