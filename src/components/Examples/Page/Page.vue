<template>
  <div>
    <div class="section">
      <div class="header">
        <div class="text-h4">Examples</div>
        <div class="text-subtitle-1">Preview some example datasets</div>
      </div>
    </div>
    <div class="content section">
      <div class="features">
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
      </div>
    </div>
    <Footer />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "@/components/Examples/Tile/Tile.vue";
import ExampleAnalysis from "@/entities/ExampleAnalysis";
import Footer from "@/components/Home/Footer/Footer.vue";

/**
 * All examples
 */
@Component({
  components: {
    Tile,
    Footer,
  },
})
export default class Examples extends Vue {
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