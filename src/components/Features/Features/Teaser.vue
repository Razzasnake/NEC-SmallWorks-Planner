<template>
  <v-card width="400px">
    <div v-editable="blok">
      <v-card-title>{{ blok.title }}</v-card-title>
      <v-card-text class="text--primary">
      <div>{{ blok.description }}</div>
    </v-card-text>
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
  @Prop()
  private blok: any;
}
</script>
<style lang='scss' scoped>
</style>