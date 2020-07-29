<template>
  <div v-editable="blok" class="full-height">
    <div class="header">
      <div class="text-h4">{{ blok.title }}</div>
      <div class="text-subtitle-1">{{ blok.subtitle }}</div>
    </div>
    <div class="content">
      <!-- @slot Content -->
      <slot></slot>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

/**
 * Wrapper for the content
 */
@Component({
  components: {},
})
export default class Wrapper extends Vue {
  /**
   * Content to display
   */
  @Prop()
  private blok: any;
}
</script>
<style lang='scss' scoped>
.header {
  height: calc(20vh + 6rem);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.content {
  background-color: #eeeeee;
  height: calc(100% - 20vh - 6rem);
}
</style>