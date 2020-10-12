<template>
  <v-card
    v-editable="teaser"
    width="397px"
  >
    <v-img
      v-if="teaser.preview && teaser.preview.filename"
      class="align-end"
      height="200px"
      :src="teaser.preview.filename"
    />
    <v-card-title>
      <router-link
        v-if="$router && buttonText"
        :to="$router ? teaser.feature.url: ''"
      >
        {{ teaser.title }}
      </router-link>
      <div v-else>
        {{ teaser.title }}
      </div>
    </v-card-title>
    <v-card-text>
      <div>{{ teaser.description }}</div>
    </v-card-text>
    <v-card-actions v-if="buttonText">
      <v-spacer />
      <v-btn
        color="primary"
        text
        :to="$router ? teaser.feature.url: ''"
      >
        {{ buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import TeaserI from "@/entities/Teaser";

/**
 * Generic teaser component
 */
@Component({
  components: {},
})
export default class Teaser extends Vue {
  /**
   * Teaser content to display
   */
  @Prop()
  private teaser!: TeaserI;
  /**
   * Button text
   */
  @Prop({ default: null })
  private buttonText!: string;
}
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>