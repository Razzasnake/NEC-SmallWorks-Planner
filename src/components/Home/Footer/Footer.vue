<template>
  <div class="foot">
    <div v-if="$vuetify.breakpoint.smAndDown">
      <div class="margin-bottom-large">
        <router-link
          v-if="$router"
          to="/"
        >
          <h4 class="text-h4">
            Table & Map
          </h4>
        </router-link>
        <h4
          v-else
          class="text-h4"
        >
          Table & Map
        </h4>
        <div class="text-subtitle-1">
          Visualize your location data
        </div>
      </div>
    </div>
    <v-row>
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="6"
      >
        <router-link
          v-if="$router"
          to="/"
        >
          <h4 class="text-h4">
            Table & Map
          </h4>
        </router-link>
        <h4
          v-else
          class="text-h4"
        >
          Table & Map
        </h4>
        <div class="text-subtitle-1">
          Visualize your location data
        </div>
      </v-col>
      <v-col
        v-for="key in Object.keys(links)"
        :key="key"
        :cols="$vuetify.breakpoint.smAndDown ? 4 : 2"
      >
        <div class="footer-links">
          <b>{{ key.toUpperCase() }}</b>
        </div>
        <div
          v-for="l in links[key]"
          :key="l.label"
          class="footer-links margin-top-small"
        >
          <router-link
            v-if="$router"
            :to="l.link"
          >
            {{ l.label }}
          </router-link>
          <a
            v-else
            :to="l.link"
          >{{ l.label }}</a>
        </div>
      </v-col>
    </v-row>
    <v-divider class="margin-top-large margin-bottom-large" />
    <div class="footer-links">
      © {{ currentYear }} Table & Map. All Rights Reserved
      <a
        v-for="(s, index) in socialLinks"
        :key="index"
        class="float-right"
        :class="{ 'margin-right-small': Boolean(index) }"
        :href="s.link"
        target="_blank"
        rel="noreferrer"
      >
        <v-icon>{{ s.icon }}</v-icon>
      </a>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { mdiGit, mdiLinkedin } from "@mdi/js";
import { mdiGithub } from "@mdi/js";
import { features, examples } from "@/entities/data";

/**
 * Footer of website
 */
@Component({
  name: "HomeFooter",
  components: {},
})
export default class Footer extends Vue {
  private links = {
    product: [
      { label: "Features", link: "/features" },
      { label: "Examples", link: "/examples" },
      { label: "Pricing", link: "/pricing" },
      { label: "Account", link: "/account" },
      { label: "Uploads", link: "/uploads" },
    ],
    features: features.map((feature) => {
      return {
        label: feature.title,
        link: feature.feature.url,
      };
    }),
    examples: examples.map((feature) => {
      return {
        label: feature.title,
        link: feature.feature.url,
      };
    }),
  };

  private socialLinks = [
    { icon: mdiLinkedin, link: "https://www.linkedin.com/company/tableandmap" },
    { icon: mdiGithub, link: "https://github.com/tjgambs/tableandmap" },
  ];

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