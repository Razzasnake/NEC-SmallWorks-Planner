<template>
  <b-dropdown v-model="viewOptionsAux" multiple>
    <div slot="trigger" class="option">
      <span>View</span>
    </div>
    <b-dropdown-item value="map">Map</b-dropdown-item>
    <b-dropdown-item value="table">Table</b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * The view dropdown in the toolbar
 */
@Component({
  components: { }
})
export default class ViewOption extends Vue {
  /**
   * What to display on the main section of the app.
   */
  @Prop({ default: () => ['map', 'table'] })
  private viewOptions!: string[]

  private get viewOptionsAux(): string[] {
    return this.viewOptions
  }
  private set viewOptionsAux(newValues: string[]) {
    this.$emit('updateViewOptions', newValues)
  }
}
</script>
<style lang='scss' scoped>
.option {
  display: flex;
  cursor: pointer;
}
</style>