<template>
  <div>
    <div class="section">
      <div class="header">
        <div class="text-h4">{{ title }}</div>
        <div class="text-subtitle-1">{{ subtitle }}</div>
      </div>
    </div>
    <div class="content section">
      <div class="features">
        <!-- @slot What to put in the content -->
        <slot></slot>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Footer from "@/components/Home/Footer/Footer.vue";

/**
 * Generic Page component
 */
@Component({
  components: {
    Footer,
  },
})
export default class Page extends Vue {
  /**
   * Title
   */
  @Prop()
  private title!: string;
  /**
   * Subtitle
   */
  @Prop()
  private subtitle!: string;
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
  .features {
    max-width: 1215px;
    margin: auto;
  }
}
</style>