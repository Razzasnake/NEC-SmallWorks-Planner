<template>
  <div class="info-section">
    <div class="text-h4 align-center">{{ title }}</div>
    <div class="margin-top-small align-center text-subtitle-1">{{ description }}</div>
    <v-row class="margin-top-large" justify="center">
      <v-card :width="cardWidth" v-for="(c, index) in cards" :key="index" class="ma-2">
        <v-card-title>
          <a v-if="c.learnMorePath" @click="$router.push(c.learnMorePath)">{{ c.title }}</a>
          <div v-else @click="$router.push(c.learnMorePath)">{{ c.title }}</div>
        </v-card-title>
        <v-card-text>
          <div>{{ c.description }}</div>
        </v-card-text>
        <v-card-actions v-if="c.learnMorePath">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$router.push(c.learnMorePath)">Learn More</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <div class="margin-top-large">
      <!-- @slot Include any extra content under the cards -->
      <slot name="extra"></slot>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Teaser from "@/components/Shared/Teaser/Teaser.vue";

/**
 * Generic component to use when creating info sections
 */
@Component({
  components: {
    Teaser,
  },
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
  private cards!: {
    title: string;
    description: string;
    learnMorePath: string | undefined;
  }[];

  private get cardWidth(): string {
    if (this.$vuetify.breakpoint.name === "xs") {
      return "100%";
    }
    return "calc(33% - 15px)";
  }
}
</script>
<style lang='scss' scoped>
.info-section {
  margin: auto;
  max-width: 1215px;
  .label {
    font-weight: bold;
  }
}
</style>