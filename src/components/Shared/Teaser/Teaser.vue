<template>
  <v-card width="397px" v-editable="blok">
    <v-img
      v-if="blok.preview && blok.preview.filename"
      class="align-end"
      height="200px"
      :src="blok.preview.filename"
    ></v-img>
    <v-card-title>
      <a
        v-if="buttonText && blok.feature.cached_url.startsWith('http')"
        @click="onClick"
      >{{ blok.title }}</a>
      <router-link v-else-if="buttonText" :to="blok.feature.cached_url">{{ blok.title }}</router-link>
      <div v-else>{{ blok.title }}</div>
    </v-card-title>
    <v-card-text>
      <div>{{ blok.description }}</div>
    </v-card-text>
    <v-card-actions v-if="buttonText">
      <v-spacer></v-spacer>
      <v-btn
        v-if="buttonText && blok.feature.cached_url.startsWith('http')"
        color="primary"
        text
        @click="onClick"
      >{{ buttonText }}</v-btn>
      <v-btn v-else color="primary" text :to="blok.feature.cached_url">{{ buttonText }}</v-btn>
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

  private onClick() {
    /**
     * Click on the teaser
     *
     * @type {TeaserI}
     */
    this.$emit("onClick", this.blok);
  }
}
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>