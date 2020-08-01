<template>
  <div class="foot">© {{ currentYear }} Table &amp; Map. All Rights Reserved</div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

/**
 * Footer of website
 */
@Component({
  components: {},
})
export default class Footer extends Vue {
  private get currentYear() {
    return new Date().getFullYear();
  }
}
</script>
<style lang='scss' scoped>
.foot {
  margin: auto;
  max-width: 1215px;
}
</style>