<template>
  <Wrapper :blok="blok">
    <template>{{ blok.content }}</template>
  </Wrapper>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Wrapper from "./Wrapper.vue";
/**
 * Storyblok feature component
 */
@Component({
  components: {
    Wrapper,
  },
})
export default class Feature extends Vue {
  /**
   * All of the content for this feature
   */
  @Prop()
  private blok: any;
}
</script>
