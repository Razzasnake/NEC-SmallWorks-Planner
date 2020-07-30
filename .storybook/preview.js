import { addDecorator } from '@storybook/vue'

import vuetify from '@/setups/vuetify'
import '@/setups/storyblok'

addDecorator(() => ({
  vuetify,
  template: '<v-app><story /></v-app>'
}))