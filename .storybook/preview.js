import { addDecorator } from "@storybook/vue";
import "@/setups/logrocket";

import Vue from "vue";
import Vuetify from "vuetify";
import "@/sass/helpers/_utility.scss";

Vue.use(Vuetify);

import { config } from "@/setups/vuetify";

addDecorator(() => ({
  vuetify: new Vuetify(config),
  template: "<v-app><story /></v-app>"
}));