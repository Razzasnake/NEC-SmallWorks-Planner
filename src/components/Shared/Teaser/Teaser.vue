<template>
  <v-card width="397px" v-editable="blok">
    <v-img
      v-if="blok.preview && blok.preview.filename"
      class="align-end"
      height="200px"
      :src="blok.preview.filename"
    ></v-img>
    <v-card-title>
      <a v-if="buttonText" @click="onClick">{{ blok.title }}</a>
      <div v-else @click="onClick">{{ blok.title }}</div>
    </v-card-title>
    <v-card-text>
      <div>{{ blok.description }}</div>
    </v-card-text>
    <v-card-actions v-if="buttonText">
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="onClick">{{ buttonText }}</v-btn>
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
     */
    this.$emit("onClick", this.blok);
  }
}
</script>