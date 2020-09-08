<template>
  <Error404Component :countdown="countdown" @goHome="goHome" />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import Error404Component from "@/components/Shared/Error404/Error404.vue";
import _View from "./_View";

/**
 * 404 status page
 */
@Component({
  components: {
    Error404Component,
  },
})
export default class Error404 extends _View {
  private countdown: number = 10;
  private interval: number | null = null;

  protected activated() {
    super.activated({
      title: "Table & Map - Page Not Found",
      content: "Page Not Found. The page you are looking for no longer exists.",
    });
    this.interval = setInterval(() => {
      this.countdown = this.countdown - 1;
      if (this.countdown === 0) {
        this.goHome();
      }
    }, 1000);
  }

  private deactivated() {
    this.countdown = 10;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private goHome() {
    this.$router.push({ name: "Home" });
  }
}
</script>