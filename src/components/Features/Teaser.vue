<template>
  <v-card width="400px">
    <div v-editable="blok">
      <v-img class="align-end" height="200px" :src="blok.preview.filename"></v-img>
      <v-card-title>
        <a @click="learnMore">{{ blok.title }}</a>
      </v-card-title>
      <v-card-text class="text--primary">
        <div>{{ blok.description }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="learnMore">Learn More</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

/**
 * Storyblok teaser component
 */
@Component({
  components: {},
})
export default class Teaser extends Vue {
  /**
   * Teaser content to display
   */
  @Prop()
  private blok: any;

  private learnMore() {
    /**
     * Learn more about this teaser
     */
    this.$emit("learnMore", this.blok);
  }
}
</script>