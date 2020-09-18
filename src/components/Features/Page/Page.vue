<template>
  <BasePage
    v-editable="blok"
    :title="blok.title"
    :subtitle="blok.subtitle"
    :img="blok.preview.filename"
  >
    <v-row justify="center">
      <Teaser
        v-for="item in blok.body"
        :key="item._uid"
        :blok="item"
        button-text="Learn More"
        class="ma-2"
      />
    </v-row>
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";
import PageI from "@/entities/storyblok/Page";
import TeaserI from "@/entities/storyblok/Teaser";
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
}
</script>