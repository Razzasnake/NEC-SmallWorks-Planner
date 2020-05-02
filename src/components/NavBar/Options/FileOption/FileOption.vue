<template>
  <b-dropdown>
    <div slot="trigger" class="option">
      <span>File</span>
    </div>
    <b-dropdown-item @click="updateSettings">Update Settings</b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Contain general functionality
 */
@Component({
  components: {}
})
export default class FileOption extends Vue {
  private updateSettings(): void {
    this.$emit("updateSettings");
  }
}
</script>
<style lang='scss' scoped>
.option {
  cursor: pointer;
}
</style>