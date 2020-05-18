<template>
  <div class="examples">
    <b-loading :active="loading"></b-loading>
    <div v-for="example in exampleAnalyses" :key="example.id" class="example">
      <Tile :exampleAnalysis="example" @preview="preview"></Tile>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "@/components/Examples/Tile/Tile.vue";
import ExampleAnalysis from "@/entities/ExampleAnalysis";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import examplesApi from "@/api/examples";

/**
 * All examples
 */
@Component({
  components: {
    Tile
  }
})
export default class Examples extends Vue {
  private exampleAnalyses: ExampleAnalysis[] = [];
  private loading = true;

  private async created() {
    this.exampleAnalyses = await examplesApi.getAllExamples();
    this.loading = false;
  }

  private async preview(exampleAnalysis: ExampleAnalysis) {
    const uploadedFile = new UploadedFile({
      data: (await exampleAnalysis.config.data()).default,
      columnSelections: exampleAnalysis.config.columnSelections,
      firstRowHeader: exampleAnalysis.config.firstRowHeader
    });
    updateUploadedFile(uploadedFile);
    this.$router.push({ name: "Explore" });
  }
}
</script>
<style lang='scss' scoped>
.examples {
  max-width: 80%;
  margin: auto;
  .example {
    padding-top: 24px;
    &:last-of-type {
      padding-bottom: 12px;
    }
  }
}
</style>