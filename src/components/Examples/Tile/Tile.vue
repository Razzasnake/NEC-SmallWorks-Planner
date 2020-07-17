<template>
  <v-card>
    <v-img class="align-end" height="200px" :src="exampleAnalysis.preview">
      <a :href="exampleAnalysis.url" target="_blank" class="white--text">
        <v-card-title>{{ exampleAnalysis.title }}</v-card-title>
      </a>
    </v-img>
    <v-card-text class="text--primary">
      <div>{{ exampleAnalysis.description }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" text @click="preview">Preview</v-btn>
    </v-card-actions>
  </v-card>
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