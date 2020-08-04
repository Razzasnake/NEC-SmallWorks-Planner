<template>
  <Status404 :countdown="countdown" />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Status404 from "@/components/Shared/Status404/Status404.vue";

/**
 * 404 status page
 */
@Component({
  components: {
    Status404,
  },
})
export default class _404 extends Vue {
  private countdown: number = 10;
  private mounted() {
    setInterval(() => {
      this.countdown = this.countdown - 1;
      if (this.countdown === 0) {
        this.$router.push({ name: "Home" });
      }
    }, 1000);
  }
}
</script>