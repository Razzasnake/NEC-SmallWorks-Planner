import NavBar from './NavBar.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: NavBar,
  title: 'NavBar|NavBar'
}

const _NavBar = () => ({
  components: { NavBar },
  template: `
    <NavBar
      @finish="finish"
    ></NavBar>`,
  methods: {
    finish: action('finish')
  }
})

export { _NavBar }