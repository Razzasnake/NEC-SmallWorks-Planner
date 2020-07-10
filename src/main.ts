import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import '@/setups/buefy'
import '@/setups/fontawesome'
import '@/setups/agGrid'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
