<template>
  <div v-editable="blok">
    <BasePage :title="blok.title" :subtitle="blok.subtitle">
      <v-row justify="center">
        <Teaser
          v-for="item in blok.body"
          :key="item._uid"
          :blok="item"
          class="ma-2"
          @learnMore="learnMore"
        ></Teaser>
      </v-row>
    </BasePage>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Teaser from "./Teaser/Teaser.vue";
import PageI from "@/entities/storyblok/Page";
import BasePage from "@/components/Shared/Page/Page.vue";

/**
 * Storyblok page component
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

  private learnMore(blok: any) {
    /**
     * Learn more about this teaser
     */
    this.$emit("learnMore", blok);
  }
}
</script>