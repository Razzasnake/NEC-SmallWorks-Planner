<template>
  <div>
    <v-img
      class="image-header"
      :src="img"
      gradient="to top, rgba(16, 84, 106, .75), rgba(16, 84, 106, .75)"
    >
      <div class="section">
        <div class="section-header">
          <div>
            <div class="text-h4">{{ title }}</div>
            <div class="text-subtitle-1">{{ subtitle }}</div>
          </div>
        </div>
      </div>
    </v-img>
    <div class="content section">
      <div class="feature">
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
  /**
   * Image to appear behind the header
   */
  @Prop({ default: null })
  private img!: string | null;
}
</script>
<style lang='scss' scoped>
.image-header {
  display: flex;
  align-items: center;
  text-align: center;
  height: calc(200px + 6rem);
  width: 100%;
  .section-header {
    max-width: 1215px;
    margin: auto;
    color: #eeeeee;
  }
}
.feature {
  max-width: 1215px;
  margin: auto;
}
</style>