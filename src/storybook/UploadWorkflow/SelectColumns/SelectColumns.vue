<template>
  <div>
    SelectColumns
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * Confirm our predictions for lat/lon or select them
 */
@Component({
  components: { }
})
export default class SelectColumns extends Vue {
  /**
   * Example Prop explanation
   */
  @Prop({ default: 'Example' })
  private exampleProp!: string
}
</script>
<style lang='scss' scoped>

</style>