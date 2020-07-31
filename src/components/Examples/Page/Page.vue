<template>
  <BasePage
    :title="blok.title"
    :subtitle="blok.subtitle"
    :img="blok.preview.filename"
    v-editable="blok"
  >
    <v-row justify="start">
      <Teaser
        v-for="item in blok.body"
        :key="item._uid"
        :blok="item"
        buttonText="Preview"
        class="ma-2"
        @onClick="preview"
      ></Teaser>
    </v-row>
  </BasePage>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";
import TeaserI from "@/entities/storyblok/Teaser";
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

  private preview(teaser: TeaserI) {
    /**
     * Open the selected teaser in the tool
     */
    this.$emit("preview", teaser);
  }
}
</script>