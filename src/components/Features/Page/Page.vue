<template>
  <div v-editable="blok">
    <div class="section">
      <div class="header">
        <div class="text-h4">{{ blok.title }}</div>
        <div class="text-subtitle-1">{{ blok.subtitle }}</div>
      </div>
    </div>
    <div class="content section">
      <div class="features">
        <v-row justify="center">
          <template v-for="item in blok.body">
            <component
              :key="item._uid"
              :blok="item"
              :is="item.component"
              class="ma-2"
              @learnMore="learnMore"
            ></component>
          </template>
        </v-row>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Teaser from "./Teaser/Teaser.vue";
import Footer from "@/components/Home/Footer/Footer.vue";
import PageI from "@/entities/storyblok/Page";

/**
 * Storyblok page component
 */
@Component({
  components: {
    Teaser,
    Footer,
  },
})
export default class Page extends Vue {
  /**
   * All of the content for this page
   */
  @Prop()
  private blok!: PageI;

  private learnMore(blok: any) {
    /**
     * Learn more about this teaser
     */
    this.$emit("learnMore", blok);
  }
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