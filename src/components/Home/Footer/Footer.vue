<template>
  <div class="foot">
    <div v-if="$vuetify.breakpoint.xs">
      <div class="margin-bottom-large">
        <router-link v-if="$router" class="text-h4" to="/">Table & Map</router-link>
        <div v-else class="text-h4">Table & Map</div>
        <div class="text-subtitle-1">Visualize your location data</div>
      </div>
    </div>
    <v-row>
      <v-col cols="6" v-if="$vuetify.breakpoint.smAndUp">
        <router-link v-if="$router" class="text-h4" to="/">Table & Map</router-link>
        <div v-else class="text-h4">Table & Map</div>
        <div class="text-subtitle-1">Visualize your location data</div>
      </v-col>
      <v-col v-for="key in Object.keys(links)" :key="key" :cols="$vuetify.breakpoint.xs ? 6 : 3">
        <div class="footer-links">
          <b>{{ key.toUpperCase() }}</b>
        </div>
        <div class="footer-links margin-top-small" v-for="l in links[key]" :key="l.label">
          <router-link v-if="$router" :to="l.link">{{ l.label }}</router-link>
          <a v-else :to="l.link">{{ l.label }}</a>
        </div>
      </v-col>
    </v-row>
    <v-divider class="margin-top-large margin-bottom-large" />
    <div class="footer-links">
      © {{ currentYear }} Table & Map. All Rights Reserved
      <a
        class="float-right"
        href="https://www.linkedin.com/company/tableandmap"
        target="_blank"
      >
        <v-icon>{{ mdiLinkedin }}</v-icon>
      </a>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { mdiLinkedin } from "@mdi/js";

/**
 * Footer of website
 */
@Component({
  components: {},
})
export default class Footer extends Vue {
  private links = {
    product: [
      { label: "Features", link: "/features" },
      { label: "Examples", link: "/examples" },
      { label: "Uploads", link: "/uploads" },
    ],
    features: [
      {
        label: "Map Your Location Data",
        link: "/features/map-your-location-data",
      },
      { label: "Filterable", link: "/features/filterable" },
      { label: "Unlimited Geocoding", link: "/features/unlimited-geocoding" },
      {
        label: "GeoJSON and Shapefile Layers",
        link: "/features/geojson-and-shapefile-layers",
      },
      {
        label: "Supports Many Markers",
        link: "/features/supports-many-markers",
      },
      { label: "Heat Map Layer", link: "/features/heat-map-layer" },
      { label: "Categorical Grouping", link: "/features/categorical-grouping" },
      { label: "Automation", link: "/features/automation" },
      {
        label: "Helpful Table Footers",
        link: "/features/helpful-table-footers",
      },
    ],
  };
  private mdiLinkedin = mdiLinkedin;

  private get currentYear() {
    return new Date().getFullYear();
  }
}
</script>
<style lang='scss' scoped>
.foot {
  margin: auto;
  max-width: 1215px;
  .footer-links {
    font-size: 13px;
  }
  a {
    text-decoration: none;
  }
}
</style>