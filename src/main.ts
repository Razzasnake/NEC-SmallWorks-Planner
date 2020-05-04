import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import Buefy from 'buefy'
import '@/sass/buefy.scss'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Buefy)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
