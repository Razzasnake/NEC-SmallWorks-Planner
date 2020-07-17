<template>
  <v-overlay class="loading" v-if="loading" :z-index="41">
    <font-awesome-icon icon="spinner" spin pulse />
    <div v-if="text">{{ text }}</div>
  </v-overlay>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Display a loading state
 */
@Component({
  components: {}
})
export default class UploadWorkflow extends Vue {
  /**
   * Optional text to display under the loader
   */
  @Prop({ default: null })
  private text!: string | null;
  /**
   * Whether or not to display the loading state.
   */
  @Prop({ type: Boolean, default: false })
  private loading!: boolean;
}
</script>
<style lang='scss' scoped>
.loading {
  text-align: center;
  svg {
    font-size: 24px;
  }
}
</style>