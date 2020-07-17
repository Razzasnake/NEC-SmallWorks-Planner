import { addDecorator } from '@storybook/vue'

import '@/setups/fontawesome'
import '@/setups/buefy'
import vuetify from '@/setups/vuetify'

addDecorator(() => ({
  vuetify,
  template: `
    <v-app>
      <v-main>
        <v-container>
          <story/>
        </v-container>
      </v-main>
    </v-app>
    `,
}));