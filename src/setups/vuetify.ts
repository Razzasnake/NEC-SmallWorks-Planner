import Vue from 'vue'

let Vuetify
if (process.env.NODE_ENV === 'production') {
  Vuetify = require('vuetify/lib')
} else {
  Vuetify = require('vuetify')
}
import '@mdi/font/css/materialdesignicons.css'
import "@/sass/helpers/_utility.scss"


Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#10546A"
      }
    }
  }
})