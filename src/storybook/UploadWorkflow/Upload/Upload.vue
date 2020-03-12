<template>
  <div>
    Upload
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * Accept a csv or excel file
 */
@Component({
  components: { }
})
export default class Upload extends Vue {
  /**
   * Example Prop explanation
   */
  @Prop({ default: 'Example' })
  private exampleProp!: string
}
</script>
<style lang='scss' scoped>

</style>