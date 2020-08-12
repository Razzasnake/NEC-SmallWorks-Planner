<template>
  <v-overlay v-if="loading" :z-index="203">
    <span v-if="max !== null && value !== null">
      <v-progress-circular
        :size="105"
        :max="max"
        :value="Math.round(value / max * 100)"
      >
      <div class="loading-text">
        <div v-if="label">{{ label }}</div>
        <div>{{ value.toLocaleString() }} / {{ max.toLocaleString() }}</div>
      </div>
      </v-progress-circular>
    </span>
    <v-progress-circular v-else :size="50" indeterminate />
  </v-overlay>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Display a loading state
 */
@Component({
  components: {},
})
export default class UploadWorkflow extends Vue {
  /**
   * Optional max value being counted to (max and value work together)
   */
  @Prop({ default: null })
  private max!: number | null;
  /**
   * Optional current value (max and value work together)
   */
  @Prop({ default: null })
  private value!: number | null;
  /**
   * Include a label inside of the loader
   */
  @Prop({ default: null })
  private label!: string | null;
  /**
   * Whether or not to display the loading state.
   */
  @Prop({ type: Boolean, default: false })
  private loading!: boolean;
}
</script>
<style lang="scss" scoped>
.loading-text {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>