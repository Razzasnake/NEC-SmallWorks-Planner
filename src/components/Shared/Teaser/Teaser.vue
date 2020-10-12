<template>
  <v-card
    v-editable="blok"
    width="397px"
  >
    <v-img
      v-if="blok.preview && blok.preview.filename"
      class="align-end"
      height="200px"
      :src="blok.preview.filename"
    />
    <v-card-title>
      <router-link
        v-if="$router && buttonText"
        :to="$router ? blok.feature.url: ''"
      >
        {{ blok.title }}
      </router-link>
      <div v-else>
        {{ blok.title }}
      </div>
    </v-card-title>
    <v-card-text>
      <div>{{ blok.description }}</div>
    </v-card-text>
    <v-card-actions v-if="buttonText">
      <v-spacer />
      <v-btn
        color="primary"
        text
        :to="$router ? blok.feature.url: ''"
      >
        {{ buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import TeaserI from "@/entities/storyblok/Teaser";

/**
 * Generic storyblok teaser component
 */
@Component({
  components: {},
})
export default class Teaser extends Vue {
  /**
   * Teaser content to display
   */
  @Prop()
  private blok!: TeaserI;
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