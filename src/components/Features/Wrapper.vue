<template>
  <div v-editable="blok" class="full-height">
    <div class="section">
      <div class="header">
        <div class="text-h4">{{ blok.title }}</div>
        <div class="text-subtitle-1">{{ blok.subtitle }}</div>
      </div>
    </div>
    <div class="content section">
      <div class="slot">
        <!-- @slot Content -->
        <slot></slot>
      </div>
    </div>
    <Footer class="section" />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Footer from "@/components/Home/Footer/Footer.vue";

/**
 * Wrapper for the content
 */
@Component({
  components: {
    Footer,
  },
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
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.content {
  background-color: #eeeeee;
  .slot {
    max-width: 1628px;
    margin: auto;
  }
}
</style>