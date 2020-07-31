<template>
  <BasePage :title="blok.title" :subtitle="blok.subtitle" :img="blok.preview.filename">
    <div class="text-h4">Health</div>
    <v-row justify="start">
      <Tile
        v-for="example in exampleAnalyses"
        :key="example.id"
        :exampleAnalysis="example"
        @preview="preview"
        class="ma-2"
      ></Tile>
    </v-row>
  </BasePage>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "@/components/Examples/Tile/Tile.vue";
import ExampleAnalysis from "@/entities/ExampleAnalysis";
import BasePage from "@/components/Shared/Page/Page.vue";
import PageI from "@/entities/storyblok/Page";

/**
 * All examples
 */
@Component({
  components: {
    Tile,
    BasePage,
  },
})
export default class Page extends Vue {
  /**
   * All of the content for this page
   */
  @Prop()
  private blok!: PageI;
  /**
   * All example analyses available for preview
   */
  @Prop({ default: [] })
  private exampleAnalyses!: ExampleAnalysis[];

  private preview(analysis: ExampleAnalysis) {
    /**
     * Open the selected tile in the tool
     */
    this.$emit("preview", analysis);
  }
}
</script>