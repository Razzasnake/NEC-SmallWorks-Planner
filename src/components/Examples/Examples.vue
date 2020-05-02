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
import Tile from "./Tile/Tile.vue";
import ExampleAnalysis from "@/entities/ExampleAnalysis";
import UploadedFile from "@/entities/UploadedFile";

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
    this.exampleAnalyses = [
      new ExampleAnalysis({
        id: 0,
        title: "Hospitals",
        description:
          "This database contains locations of Hospitals for 50 states and Washington D.C. , Puerto Rico and US territories. The dataset only includes hospital facilities and does not include nursing homes. Data for all the states was acquired from respective states departments or their open source websites and then geocoded and converted into a spatial database.",
        preview: require("@/assets/examples/hospitals/preview.jpg"),
        url: "https://hifld-geoplatform.opendata.arcgis.com/datasets/hospitals",
        createdOn: new Date(),
        config: {
          data: (await import("@/assets/examples/hospitals/data")).default,
          columnSelections: {
            lat: 15,
            lng: 16
          },
          firstRowHeader: true
        }
      })
    ];
    this.loading = false
  }

  private preview(exampleAnalysis: ExampleAnalysis) {
    const uploadedFile = new UploadedFile({
      data: exampleAnalysis.config.data,
      columnSelections: exampleAnalysis.config.columnSelections,
      firstRowHeader: exampleAnalysis.config.firstRowHeader
    });
    /**
     * Emit the uploaded file
     */
    this.$emit("finish", uploadedFile);
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