<template>
  <div class="card tile">
    <div class="card-content">
      <div class="content columns">
        <div class="column is-one-half">
          <img :src="exampleAnalysis.preview" />
        </div>
        <div class="column">
          <div class="subtitle">
            <span>{{ exampleAnalysis.title }}</span>
            <span class="example-tags float-right">
              <a :href="exampleAnalysis.url" target="_blank" class="source">Source</a>
              <span class="tag is-light">Live</span>
            </span>
          </div>
          <div class="description">{{ exampleAnalysis.description }}</div>
          <div class="align-right padding-top-large">
            <button class="button is-primary" @click="preview">Preview</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import ExampleAnalysis from "@/entities/ExampleAnalysis";

/**
 * One exampleAnalysis tile
 */
@Component({
  components: {}
})
export default class Tile extends Vue {
  /**
   * Example analysis for user to use as a trial
   */
  @Prop()
  private exampleAnalysis!: ExampleAnalysis;

  private preview() {
    /**
     * Preview this example
     *
     * @type {ExampleAnalysis}
     */
    this.$emit("preview", this.exampleAnalysis);
  }
}
</script>
<style lang='scss' scoped>
.tile {
  max-width: 1024px;
  margin: auto;
  .example-tags {
    display: flex;
    .source {
      margin: auto;
      padding-right: 8px;
      font-size: 14px;
    }
  }
}
</style>