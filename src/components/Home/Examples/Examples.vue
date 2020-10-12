<template>
  <div>
    <h4 class="align-center text-h4">
      Try an example dataset
    </h4>
    <v-row
      justify="center"
      class="margin-top-large"
    >
      <Teaser
        v-for="(item, index) in examples"
        :key="index"
        :teaser="item"
        button-text="Preview"
        class="ma-2"
        @on-click="preview"
      />
    </v-row>
    <div class="margin-top-large align-center">
      <v-btn
        color="primary"
        outlined
        :to="$router ? '/examples': ''"
      >
        See All Examples
      </v-btn>
    </div>
    <Loading :loading="loading" />
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";
import Loading from "@/components/Shared/Loading/Loading.vue";
import ExampleTeaserI from "@/entities/ExampleTeaser";
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