<template>
  <BasePage
    :title="blok.title"
    :subtitle="blok.subtitle"
    :img="blok.preview.filename"
    v-editable="blok"
  >
    <div v-for="key in Object.keys(groupByBloks)" :key="key" class="slide-group-container">
      <div class="text-h4">{{ key }}</div>
      <v-slide-group show-arrows>
        <v-slide-item v-for="item in groupByBloks[key]" :key="item._uid">
          <Teaser :blok="item" buttonText="Preview" class="ma-2" @onClick="preview"></Teaser>
        </v-slide-item>
      </v-slide-group>
    </div>
  </BasePage>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";
import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";
import BasePage from "@/components/Shared/Page/Page.vue";
import PageI from "@/entities/storyblok/Page";

/**
 * All examples
 */
@Component({
  components: {
    Teaser,
    BasePage,
  },
})
export default class Page extends Vue {
  /**
   * All of the content for this page
   */
  @Prop()
  private blok!: PageI;
  private groupByBloks: { [key: string]: ExampleTeaserI[] } = {};

  private created() {
    this.computeGroupByBloks();
  }

  @Watch("blok")
  private computeGroupByBloks() {
    const groupBy: { [key: string]: ExampleTeaserI[] } = {};
    (this.blok.body as ExampleTeaserI[]).forEach((example) => {
      if (!groupBy[example.type]) {
        groupBy[example.type] = [];
      }
      groupBy[example.type].push(example);
    });
    this.groupByBloks = groupBy;
  }

  private preview(teaser: ExampleTeaserI) {
    /**
     * Open the selected teaser in the tool
     */
    this.$emit("preview", teaser);
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