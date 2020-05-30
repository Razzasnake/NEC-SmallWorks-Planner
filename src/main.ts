import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import '@/setups/buefy'
import '@/setups/fontawesome'

if (process.env.VUE_APP_MODE === 'production') {
  Vue.config.devtools = false;
  Vue.config.silent = true; 
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
