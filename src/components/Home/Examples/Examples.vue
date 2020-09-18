<template>
  <div>
    <div class="align-center text-h4">Try an example dataset</div>
    <v-row justify="center" class="margin-top-large">
      <Teaser
        :blok="item"
        buttonText="Preview"
        class="ma-2"
        @onClick="preview"
        v-for="(item, index) in examples"
        :key="index"
      ></Teaser>
    </v-row>
    <div class="margin-top-large align-center">
      <v-btn color="primary" outlined :to="$router ? '/examples': ''">See All Examples</v-btn>
    </div>
    <Loading :loading="loading" />
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";
import Loading from "@/components/Shared/Loading/Loading.vue";
import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";
import { examples } from "@/entities/data";

/**
 * Display a preview of the available examples that are currently available
 */
@Component({
  components: {
    Teaser,
    Loading,
  },
})
export default class Examples extends Vue {
  private loading: boolean = false;
  private examples = examples.slice(0, 3);

  private async preview(teaser: ExampleTeaserI) {
    /**
     * Open the selected teaser in the tool
     *
     * @type {ExampleTeaserI}
     */
    this.$emit("preview", teaser);
  }
}
</script>