<template>
  <div v-editable="blok">
    <div class="header">
      <div class="text-h4">{{ blok.title }}</div>
      <div class="text-subtitle-1">{{ blok.subtitle }}</div>
    </div>
    <div class="content">
      <v-container>
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
      </v-container>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Teaser from "./Teaser.vue";

/**
 * Storyblok page component
 */
@Component({
  components: {
    Teaser,
  },
})
export default class Page extends Vue {
  /**
   * All of the content for this page
   */
  @Prop()
  private blok: any;

  private learnMore(blok: any) {
    console.log(blok);
  }
}
</script>
<style lang='scss' scoped>
.header {
  height: calc(20vh + 6rem);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.content {
  background-color: #eeeeee;
  height: calc(100% - 20vh - 6rem);
}
</style>