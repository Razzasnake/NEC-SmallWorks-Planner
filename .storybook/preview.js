import { addDecorator } from "@storybook/vue";
import "@/setups/logrocket";

import Vue from "vue";
import Vuetify from "vuetify";
import "@/sass/helpers/_utility.scss";

Vue.use(Vuetify);

const config = {
  icons: {
    iconfont: "mdiSvg",
  },
  theme: {
    themes: {
      light: {
        primary: "#37474f"
      }
    }
  }
};

addDecorator(() => ({
  vuetify: new Vuetify(config),
  template: "<v-app><story /></v-app>"
}));