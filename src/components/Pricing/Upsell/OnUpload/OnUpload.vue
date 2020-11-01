<template>
  <v-dialog
    v-model="visible"
    max-width="700"
  >
    <v-card>
      <v-card-title class="headline center">
        Upgrade to Pro for unlimited rows and uploads
      </v-card-title>
      <v-card-text>
        <Tiers />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="visible = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

/**
 * On upload upsell modal
 */
@Component({
  name: "PricingUpsellOnUpload",
  components: {
    Tiers: () => import("@/components/Pricing/Tiers/Tiers.vue"),
  },
})
export default class OnUpload extends Vue {
  private visibleAux: boolean = true;
  private get visible() {
    return this.visibleAux;
  }
  private set visible(newValue: boolean) {
    if (!newValue) {
      /**
       * Close the upsell modal
       */
      this.$emit("close");
    }
    this.visibleAux = newValue;
  }
}
</script>
<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
}
</style>