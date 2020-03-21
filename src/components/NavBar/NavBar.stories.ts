import NavBar from './NavBar.vue'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  component: NavBar,
  title: 'NavBar|NavBar'
}

const _NavBar = () => ({
  components: { NavBar },
  template: `
    <NavBar
      :displayUpload="displayUpload"
      @finish="finish"
    ></NavBar>`,
  props: {
    displayUpload: {
      default: boolean('displayUpload', true)
    }
  },
  methods: {
    finish: action('finish')
  }
})

export { _NavBar }