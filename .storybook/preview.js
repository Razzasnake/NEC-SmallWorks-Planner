import { addDecorator } from '@storybook/vue'

import vuetify from '@/setups/vuetify'

addDecorator(() => ({
  vuetify,
  template: '<v-app><story /></v-app>'
}))