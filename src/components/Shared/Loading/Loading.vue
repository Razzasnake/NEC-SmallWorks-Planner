<template>
  <b-loading :active="loading">
    <div class="loading">
      <div>
        <font-awesome-icon class="icon" icon="spinner" spin pulse />
      </div>
      <div v-if="text">{{ text }}</div>
    </div>
  </b-loading>
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
  color: grey;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    font-size: 24px;
  }
}
</style>