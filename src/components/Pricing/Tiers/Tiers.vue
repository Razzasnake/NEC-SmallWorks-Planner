<template>
  <v-row class="tiers">
    <v-col
      v-for="(t, index) in tiers"
      :key="t.title"
    >
      <v-card :class="{ active: index === activeTier }">
        <v-card-title class="center">
          {{ t.title }}
        </v-card-title>
        <v-card-subtitle class="center">
          {{ t.subtitle }}
        </v-card-subtitle>
        <v-card-text>
          <div class="center text-h5 margin-bottom-large">
            {{ t.price }}
          </div>
          <div
            v-for="o in t.options"
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
            :outlined="index === activeTier"
            :disabled="index === activeTier"
            @click="t.action.action"
          >
            {{ t.action.title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { mdiCheck } from "@mdi/js";
import state from "@/store/driveStore";

/**
 * Pricing tiers
 */
@Component({
  components: {},
})
export default class Tiers extends Vue {
  private mdiCheck = mdiCheck;

  private get user() {
    return state.user;
  }

  private get activeTier() {
    return state.tier;
  }

  private get tiers() {
    return [
      {
        title: "Starter",
        subtitle: "If you have a few files to upload.",
        price: "Free",
        options: [
          "5 Uploads",
          "Unlimited Rows",
          "Unlimited, Fast Geocoding",
          "Google Drive Integration",
          "Heat Map Layer",
          "Groupings",
          "GeoJSON and Shapefile Support",
          "Street View Integration",
          "Export",
        ],
        action: {
          title: this.activeTier === 0 ? "Current Plan" : "Get Started",
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
        title: "Pro",
        subtitle: "If you have a lot of files to upload.",
        price: "$9.99 / month",
        options: [
          "Starter Plan",
          "Unlimited Uploads",
          "Guaranteed Access to Future Features",
        ],
        action: {
          title: this.user ? ( this.activeTier === 1 ? "Current Plan" : "Upgrade" ) : "Sign in to upgrade",
          action: () => {
            if (this.user) {
              const stripe = Stripe(process.env.VUE_APP_STRIPE_PRODUCT_ID);
              stripe.redirectToCheckout({
                lineItems: [{
                  price: process.env.VUE_APP_STRIPE_PRICE_ID,
                  quantity: 1,
                }],
                mode: "subscription",
                successUrl: process.env.VUE_APP_BASE_URL + "/account",
                cancelUrl: process.env.VUE_APP_BASE_URL + this.$route.path,
                customerEmail: this.user.getBasicProfile().getEmail()
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
  width: 842px;
  margin: auto;
  .center {
    display: flex;
    justify-content: center;
  }
  .active {
    box-shadow: 0px 0px 0px 3px #37474f;
  }
}
</style>
