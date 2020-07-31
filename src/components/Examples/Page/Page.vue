<template>
  <BasePage title="Examples" subtitle="Preview some example datasets">
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