<template>
  <div class="info-section">
    <template v-if="$vuetify.breakpoint.smAndDown">
      <h4 class="text-h4 align-center">
        {{ title }}
      </h4>
      <div class="margin-top-medium align-center text-subtitle-1 small-title">
        {{ subtitle }}
      </div>
      <Preview class="margin-top-large" />
    </template>
    <template v-else>
      <v-row>
        <v-col cols="8">
          <Preview />
        </v-col>
        <v-col class="not-small-title">
          <div>
            <h4 class="text-h4">
              {{ title }}
            </h4>
            <div class="margin-top-medium text-subtitle-1">
              {{ subtitle }}
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
    <v-row
      class="margin-top-large"
      justify="center"
    >
      <v-card
        v-for="(c, index) in cards"
        :key="index"
        :width="cardWidth"
        class="ma-2"
      >
        <v-card-title>
          <router-link
            v-if="$router"
            :to="$router ? c.learnMorePath: ''"
          >
            {{ c.title }}
          </router-link>
          <a v-else>{{ c.title }}</a>
        </v-card-title>
        <v-card-text>
          <div>{{ c.description }}</div>
          <div class="info-description" />
          <div class="card-actions">
            <v-spacer />
            <v-btn
              color="primary"
              text
              :to="$router ? c.learnMorePath: ''"
            >
              Learn More
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-row>
    <div class="margin-top-large align-center">
      <v-btn
        color="primary"
        outlined
        :to="$router ? '/features': ''"
      >
        See All Features
      </v-btn>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Preview from "@/components/Home/Preview/Preview.vue";

/**
 * Display the features that are currently available
 */
@Component({
  name: "HomeFeatures",
  components: {
    Preview,
  },
})
export default class Features extends Vue {
  private title = "Plot Addresses on a Map";
  private subtitle =
    "Upload an excel, csv or json file with addresses or latitudes and longitudes to plot your data on an interactive map.";
  private cards = [
    {
      title: "Unlimited Geocoding",
      description:
        "Visualize your location data without a latitude or longitude. Just select the location columns and we take care of the rest.",
      learnMorePath: "/features/unlimited-geocoding",
    },
    {
      title: "GeoJSON and Shapefile Layers",
      description:
        "Upload GeoJSON and Shapefiles to visualize the regions markers fall within.",
      learnMorePath: "/features/geojson-and-shapefile-layers",
    },
    {
      title: "Categorical Grouping",
      description:
        "Select a categorical column to group by and see the marker colors update, one color for each category.",
      learnMorePath: "/features/categorical-grouping",
    },
  ];

  private get cardWidth(): string {
    if (this.$vuetify.breakpoint.xs) {
      return "100%";
    }
    return "calc(33% - 15px)";
  }
}
</script>
<style lang='scss' scoped>
.info-section {
  .info-description {
    margin-bottom: 42px;
  }
  .card-actions {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
  a {
    text-decoration: none;
  }
  .small-title {
    max-width: 600px;
    margin: auto;
  }
  .not-small-title {
    display: flex;
    div {
      margin: auto;
    }
  }
}
</style>