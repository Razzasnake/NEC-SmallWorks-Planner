<template>
  <b-navbar-dropdown label="File">
    <b-navbar-item @click="updateSettings">Update Settings</b-navbar-item>
  </b-navbar-dropdown>
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
    /**
     * Update settings
     */
    this.$emit("updateSettings");
  }
}
</script>
<style lang='scss' scoped>
</style>