<template>
  <div>
    <v-img
      class="image-header"
      :src="img"
      gradient="to top, rgba(38, 50, 56, .75), rgba(38, 50, 56, .75)"
    >
      <div class="section">
        <div class="section-header">
          <div>
            <h1 :class="titleClass">{{ title }}</h1>
            <h6 class="text-h6">{{ subtitle }}</h6>
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
    <div class="section">
      <Footer />
    </div>
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

  private get titleClass() {
    return this.$vuetify.breakpoint.xs ? "text-h3" : "text-h2";
  }
}
</script>
<style lang='scss' scoped>
.image-header {
  display: flex;
  align-items: center;
  height: calc(200px + 6rem);
  width: 100%;
  .section-header {
    max-width: 1215px;
    margin: auto;
    color: #eeeeee;
  }
  @media (max-width: 1215px) {
    .section-header {
      width: 100%;
    }
  }
}
.feature {
  max-width: 1215px;
  margin: auto;
}
</style>