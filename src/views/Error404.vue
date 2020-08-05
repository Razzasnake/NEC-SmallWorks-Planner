<template>
  <Error404Component :countdown="countdown" @goHome="goHome" />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Error404Component from "@/components/Shared/Error404/Error404.vue";

/**
 * 404 status page
 */
@Component({
  components: {
    Error404Component,
  },
})
export default class Error404 extends Vue {
  private countdown: number = 10;
  private interval: number | null = null;

  private activated() {
    document.title = "Table & Map - Page Not Found";
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