import Vue from 'vue'

let Vuetify
if (process.env.NODE_ENV === 'production') {
  Vuetify = require('vuetify/lib').default
} else {
  Vuetify = require('vuetify')
}
import "@/sass/helpers/_utility.scss"


Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    themes: {
      light: {
        primary: "#37474f"
      }
    }
  }
})