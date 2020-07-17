import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import '@/setups/buefy'
import '@/setups/fontawesome'
import vuetify from '@/setups/vuetify'

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
