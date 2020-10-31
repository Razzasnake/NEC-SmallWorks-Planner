<template>
  <div>
    <v-row
      v-if="$vuetify.breakpoint.smAndUp"
      class="tiers"
    >
      <v-col
        v-for="tier in tiers"
        :key="tier.title"
      >
        <Tier :tier="tier" />
      </v-col>
    </v-row>
    <v-row
      v-for="tier in tiers"
      v-else
      :key="tier.title"
    >
      <v-col>
        <Tier :tier="tier" />
      </v-col>
    </v-row>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state from "@/store/driveStore";
import Tier from "./Tier.vue";

/**
 * Pricing tiers
 */
@Component({
  components: {
    Tier,
  },
})
export default class Tiers extends Vue {
  private get tiers() {
    return [
      {
        id: 0,
        title: "Starter",
        subtitle: "If you have a few files to upload.",
        price: "Free",
        options: [
          `${parseInt(process.env.VUE_APP_STRIPE_MAX_UPLOADS!).toLocaleString()} Uploads`,
          `${parseInt(process.env.VUE_APP_STRIPE_MAX_ROWS!).toLocaleString()} Rows`,
          "Unlimited, Fast Geocoding",
          "Google Drive Integration",
          "Heat Map Layer",
          "Groupings",
          "GeoJSON and Shapefile Support",
          "Street View Integration",
          "Export",
          "Shareable Links"
        ],
        action: {
          title: state.tier === 0 ? "Current Plan" : "Get Started",
          action: () => {
            if (this.$router) {
              if (this.$router.currentRoute.name !== "Home") {
                this.$router.push({ name: "Home" });
              } else {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }
            }
          },
        },
      },
      {
        id: 1,
        title: "Pro",
        subtitle: "If you have a lot of files to upload.",
        price: "$9.99 / month",
        options: [
          "Starter Plan",
          "Unlimited Rows",
          "Unlimited Uploads"
        ],
        action: {
          title: state.user
            ? state.tier === 1
              ? "Current Plan"
              : "Upgrade"
            : "Sign in to upgrade",
          action: () => {
            if (state.user) {
              const stripe = Stripe(process.env.VUE_APP_STRIPE_PRODUCT_ID);
              stripe.redirectToCheckout({
                lineItems: [
                  {
                    price: process.env.VUE_APP_STRIPE_PRICE_ID,
                    quantity: 1,
                  },
                ],
                mode: "subscription",
                successUrl: process.env.VUE_APP_BASE_URL + "/account",
                cancelUrl: process.env.VUE_APP_BASE_URL + this.$route.path,
                customerEmail: state.user.getBasicProfile().getEmail(),
              });
            } else {
              const el = document.getElementById("google-signin-button");
              if (el) {
                const child = el.children[0] as HTMLElement;
                child.click();
              }
            }
          },
        },
      },
    ];
  }
}
</script>
<style lang="scss" scoped>
.tiers {
  max-width: 842px;
  margin: auto;
}
</style>
