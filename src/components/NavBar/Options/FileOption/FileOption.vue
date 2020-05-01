<template>
  <b-dropdown>
    <div slot="trigger" class="option">
      <span>File</span>
    </div>
    <b-dropdown-item @click="clearFilters">Clear Filters</b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * Contain general functionality
 */
@Component({
  components: { }
})
export default class FileOption extends Vue {
  private clearFilters(): void {
    this.$emit('clearFilters')
  }
}
</script>
<style lang='scss' scoped>
.option {
  display: flex;
  cursor: pointer;
}
</style>