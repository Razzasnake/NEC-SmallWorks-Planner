<template>
  <div class="examples">
    <div v-for="example in exampleAnalyses" :key="example.id" class="example">
      <Tile :exampleAnalysis="example" @preview="preview"></Tile>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "./Tile/Tile.vue";
import ExampleAnalysis from "@/entities/ExampleAnalysis";

/**
 * All examples
 */
@Component({
  components: {
    Tile
  }
})
export default class Examples extends Vue {
  /**
   * Example analyses for user to use as a trial
   */
  @Prop({ default: () => [] })
  private exampleAnalyses!: ExampleAnalysis[];

  private preview(exampleAnalysis: ExampleAnalysis) {
    /**
     * Preview this example
     *
     * @type {ExampleAnalysis}
     */
    this.$emit("preview", exampleAnalysis);
  }
}
</script>
<style lang='scss' scoped>
.examples {
  max-width: 1024px;
  margin: auto;
  .example {
    margin: 20px;
  }
}
</style>