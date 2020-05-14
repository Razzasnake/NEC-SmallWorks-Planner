import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUpload)
library.add(faEye)
library.add(faEyeSlash)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

import Buefy from 'buefy'
import '@/sass/buefy.scss'

Vue.use(Buefy)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
