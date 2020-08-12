import { addDecorator } from '@storybook/vue'
import { config } from '@/setups/vuetify'

import Vue from 'vue'
import Vuetify from "vuetify"
import "@/sass/helpers/_utility.scss"

Vue.use(Vuetify)

addDecorator(() => ({
  vuetify: new Vuetify(config),
  template: '<v-app><story /></v-app>'
}))