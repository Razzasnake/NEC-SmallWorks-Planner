<template>
  <BasePage
    title="Examples"
    subtitle="See how Table & Map can add value by trying one of our datasets."
    :img="require('@/assets/mapwithmarkers.jpg')"
    @finish="finish"
  >
    <div
      v-for="key in Object.keys(groupByTeasers)"
      :key="key"
      class="slide-group-container"
    >
      <h4 class="text-h4">
        {{ key }}
      </h4>
      <v-row
        v-if="$vuetify.breakpoint.xs"
        justify="center"
      >
        <Teaser
          v-for="item in groupByTeasers[key]"
          :key="item._uid"
          :teaser="item"
          button-text="Preview"
          class="ma-2"
        />
      </v-row>
      <v-slide-group
        v-else
        show-arrows
      >
        <v-slide-item
          v-for="item in groupByTeasers[key]"
          :key="item._uid"
        >
          <Teaser
            :teaser="item"
            button-text="Preview"
            class="ma-2"
          />
        </v-slide-item>
      </v-slide-group>
    </div>
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";
import ExampleTeaserI from "@/entities/ExampleTeaser";
import BasePage from "@/components/Shared/Page/Page.vue";
import { examples } from "@/entities/data";
import UploadedFile from "@/entities/UploadedFile";

/**
 * All examples
 */
@Component({
  name: "ExamplesPage",
  components: {
    Teaser,
    BasePage,
  },
})
export default class Page extends Vue {
  private groupByTeasers: { [key: string]: ExampleTeaserI[] } = {};

  private created() {
    examples.forEach((example) => {
      if (!this.groupByTeasers[example.type]) {
        this.groupByTeasers[example.type] = [];
      }
      this.groupByTeasers[example.type].push(example);
    });
  }

  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     *
     * @type {UploadedFile}
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang="scss" scoped>
.slide-group-container {
  &:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>