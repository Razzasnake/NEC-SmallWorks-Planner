<template>
  <div class="info-section">
    <div class="title align-center">{{ title }}</div>
    <div class="margin-top-large align-center">{{ description }}</div>
    <div class="margin-top-large columns">
      <div v-for="(c, index) in cards" :key="index" class="column">
        <div class="label">{{ c.title }}</div>
        <div>{{ c.description }}</div>
      </div>
    </div>
    <div class="margin-top-large">
      <!-- @slot Include any extra content under the cards -->
      <slot name="extra"></slot>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Generic component to use when creating info sections
 */
@Component({
  components: {}
})
export default class InfoSection extends Vue {
  /**
   * Title of the info section
   */
  @Prop({ default: "" })
  private title!: string;
  /**
   * Description of the info section
   */
  @Prop({ default: "" })
  private description!: string;
  /**
   * Cards of information, essentially bullet points to include
   */
  @Prop({ default: () => [] })
  private cards!: { title: string; description: string }[];
}
</script>
<style lang='scss' scoped>
.info-section {
  margin: auto;
  max-width: 1024px;
}
</style>