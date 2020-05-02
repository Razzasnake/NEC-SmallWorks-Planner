<template>
  <div class="card">
    <div class="card-content">
      <div class="content columns">
        <div class="column is-one-half">
          <img :src="exampleAnalysis.img" />
        </div>
        <div class="column">
          <div class="title">
            <span>{{ exampleAnalysis.title }}</span>
            <span class="float-right">
              <b-tag type="is-light">{{ exampleAnalysis.formattedCreatedOn }}</b-tag>
            </span>
          </div>
          <div class="description">{{ exampleAnalysis.description }}</div>
          <div class="align-right padding-top">
            <div class="button is-primary" @click="preview">Preview</div>
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
.align-right {
  text-align: right;
}
.float-right {
  float: right;
}
.padding-top {
  margin-top: 24px;
}
</style>