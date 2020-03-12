<template>
  <div>
    <Upload></Upload>
    <SelectColumns></SelectColumns>
    <Upsell></Upsell>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import Upload from './Upload/Upload.vue'
import SelectColumns from './SelectColumns/SelectColumns.vue'
import Upsell from './Upsell/Upsell.vue'

/**
 * Add all of the parts of the workflow together
 */
@Component({
  components: {
    Upload,
    SelectColumns,
    Upsell
  }
})
export default class UploadWorkflow extends Vue {
  /**
   * Example Prop explanation
   */
  @Prop({ default: 'Example' })
  private exampleProp!: string
}
</script>
<style lang='scss' scoped>

</style>