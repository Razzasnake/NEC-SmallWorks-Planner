<template>
  <div>
    NavBar
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: { }
})
export default class NavBar extends Vue {
  /**
   * Example Prop explanation
   */
  @Prop({ default: 'Example' })
  private exampleProp!: string
}
</script>
<style lang='scss' scoped>

</style>