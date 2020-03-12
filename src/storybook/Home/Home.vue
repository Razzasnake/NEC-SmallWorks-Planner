<template>
  <div>
    Home
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * Contain content about what TableAndMap is and what it does
 */
@Component({
  components: { }
})
export default class Home extends Vue {
  /**
   * Example Prop explanation
   */
  @Prop({ default: 'Example' })
  private exampleProp!: string
}
</script>
<style lang='scss' scoped>

</style>