<template>
  <v-container>
    <Loading :loading="loading" />
    <v-row justify="center">
      <Tile
        v-for="example in exampleAnalyses"
        :key="example.id"
        :exampleAnalysis="example"
        @preview="preview"
        class="ma-2"
      ></Tile>
    </v-row>
  </v-container>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "@/components/Examples/Tile/Tile.vue";
import ExampleAnalysis from "@/entities/ExampleAnalysis";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";
import examplesApi from "@/api/examples";
import Loading from "@/components/Shared/Loading/Loading.vue";

/**
 * All examples
 */
@Component({
  components: {
    Tile,
    Loading
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
    this.loading = true;
    this.$nextTick(async () => {
      const uploadedFile = new UploadedFile({
        data: (await exampleAnalysis.config.data()).default,
        columnSelections: exampleAnalysis.config.columnSelections,
        firstRowHeader: exampleAnalysis.config.firstRowHeader
      });
      updateUploadedFile(uploadedFile);
      this.$router.push({ name: "Explore" });
      this.loading = false;
    });
  }
}
</script>