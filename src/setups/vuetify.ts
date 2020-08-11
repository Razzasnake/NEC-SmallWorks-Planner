import Vue from 'vue'
import Vuetify from "vuetify/lib"
import "@/sass/helpers/_utility.scss"

Vue.use(Vuetify)

const config: any = {
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
}

export { config }

export default new Vuetify(config)