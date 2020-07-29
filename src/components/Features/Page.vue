<template>
  <Wrapper :blok="blok">
    <v-row justify="center">
      <template v-for="item in blok.body">
        <component
          :key="item._uid"
          :blok="item"
          :is="item.component"
          class="ma-2"
          @learnMore="learnMore"
        ></component>
      </template>
    </v-row>
  </Wrapper>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Teaser from "./Teaser.vue";
import Wrapper from "./Wrapper.vue";

/**
 * Storyblok page component
 */
@Component({
  components: {
    Teaser,
    Wrapper,
  },
})
export default class Page extends Vue {
  /**
   * All of the content for this page
   */
  @Prop()
  private blok: any;

  private learnMore(blok: any) {
    /**
     * Learn more about this teaser
     */
    this.$emit("learnMore", blok);
  }
}
</script>