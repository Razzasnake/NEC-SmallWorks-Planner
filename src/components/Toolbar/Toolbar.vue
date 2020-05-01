<template>
  <div class="padding-lr-10">
    <FileOption
      @clearFilters="clearFilters"
    ></FileOption>
    <ViewOption
      :viewOptions="viewOptions"
      @updateViewOptions="updateViewOptions"
    ></ViewOption>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import ViewOption from './Options/ViewOption/ViewOption.vue'
import FileOption from './Options/FileOption/FileOption.vue'

/**
 * Contain functionality to customize the view
 */
@Component({
  components: {
    ViewOption,
    FileOption
  }
})
export default class Toolbar extends Vue {
  /**
   * What to display on the main section of the app.
   */
  @Prop({ default: () => ['map', 'table'] })
  private viewOptions!: string[]

  private updateViewOptions(options: string) {
    this.$emit('updateViewOptions', options)
  }

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
.padding-lr-10 {
  padding-left: 10px;
  padding-right: 10px;
}
</style>