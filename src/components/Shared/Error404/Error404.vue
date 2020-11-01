<template>
  <v-img
    class="image-header"
    :src="require('@/assets/app2.jpg')"
    gradient="to top, rgba(38, 50, 56, .80), rgba(38, 50, 56, .80)"
  >
    <div class="section-header">
      <div class="section">
        <h2 class="text-h2">
          404 - Page Not Found
        </h2>
        <div class="text-subtitle-1">
          The page you are looking for no longer exists.
        </div>
        <h6 class="text-h6 margin-top-large">
          <router-link
            v-if="$router"
            to="/"
          >
            Back home
          </router-link>
          <a
            v-else
            href="/"
          >
            Back home
          </a>
          in {{ time }}
        </h6>
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
  name: "SharedError404",
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
  a {
    text-decoration: none;
    color: #eeeeee;
  }
}
</style>