<template>
  <v-card :class="{ active: tier.id === activeTier }">
    <v-card-title class="center">
      {{ tier.title }}
    </v-card-title>
    <v-card-subtitle class="center">
      {{ tier.subtitle }}
    </v-card-subtitle>
    <v-card-text>
      <div class="center text-h5 margin-bottom-large">
        {{ tier.price }}
      </div>
      <div
        v-for="o in tier.options"
        :key="o"
        class="text-subtitle-1"
      >
        <v-icon>{{ mdiCheck }}</v-icon> {{ o }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        class="full-width"
        :outlined="tier.id === activeTier"
        :disabled="tier.id === activeTier"
        @click="tier.action.action"
      >
        {{ tier.action.title }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { mdiCheck } from "@mdi/js";
import state from "@/store/driveStore";

/**
 * Pricing tier
 */
@Component({
  name: "PricingTier",
  components: {},
})
export default class Tier extends Vue {
  /**
   * One of the available tiers
   */
  @Prop()
  private tier!: {
    id: number,
    title: string;
    subtitle: string;
    price: string;
    options: string[];
    action: { title: string; action: () => void };
  };
  private mdiCheck = mdiCheck;

  private get activeTier() {
    return state.tier;
  }
}
</script>
<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
}
.active {
  box-shadow: 0px 0px 0px 3px #37474f !important;
}
</style>