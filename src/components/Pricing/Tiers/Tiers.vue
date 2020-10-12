<template>
  <v-row class="tiers">
    <v-col
      v-for="t in tiers"
      :key="t.title"
    >
      <v-card>
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
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { mdiCheck } from "@mdi/js";

/**
 * Pricing tiers
 */
@Component({
  components: {},
})
export default class Tiers extends Vue {
  private mdiCheck = mdiCheck;
  private tiers = [
    {
      title: "Starter",
      subtitle: "If you have a few files to upload.",
      price: "Free",
      options: [
        "10 Uploads",
        "Unlimited Rows",
        "Unlimited, Fast Geocoding",
        "Google Drive Integration",
        "Heat Map Layer",
        "Groupings",
        "GeoJSON and Shapefile Support",
        "Street View Integration",
        "Export",
      ],
    },
    {
      title: "Pro",
      subtitle: "If you have a lot of files to upload.",
      price: "$9.99 / month",
      options: [
        "Starter Plan",
        "Unlimited Uploads",
        "Guaranteed Access to Future Features"
      ],
    },
  ];
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
}
</style>
