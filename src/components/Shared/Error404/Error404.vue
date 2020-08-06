<template>
  <v-img
    class="image-header"
    src="https://a.storyblok.com/f/89733/2545x1253/653593bd7d/app.jpg"
    gradient="to top, rgba(38, 50, 56, .75), rgba(38, 50, 56, .75)"
  >
    <div class="section-header">
      <div class="section">
        <div class="text-h2">404 - Page Not Found</div>
        <div class="text-subtitle-1">The page you are looking for no longer exists.</div>
        <div class="text-h6 margin-top-large">
          <a @click="goHome" class="go-home">Back home</a>
          in {{ time }}
        </div>
      </div>
    </div>
  </v-img>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Display a 404 page
 */
@Component({
  components: {},
})
export default class Error404 extends Vue {
  /**
   * Seconds remaining until redirected to the home page
   */
  @Prop({ default: 0 })
  private countdown!: number;

  private get time(): string {
    let time = this.countdown.toString();
    if (time.length === 1) {
      return `00:00:0${time}`;
    }
    return `00:00:${time}`;
  }

  private goHome() {
    /**
     * Notify parent that the user wants to be navigated home now.
     */
    this.$emit("goHome");
  }
}
</script>
<style lang="scss" scoped>
.image-header {
  display: flex;
  align-items: center;
  height: calc(100vh - 48px);
  width: 100%;
  .section-header {
    width: 1215px;
    margin: auto;
    color: #eeeeee;
  }
  @media (max-width: 1215px) {
    .section-header {
      width: 100%;
    }
  }
  .go-home {
    color: #eeeeee;
  }
}
</style>