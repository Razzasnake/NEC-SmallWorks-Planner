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
    <NavBar :drawerAllowed="drawerAllowed" @jumpTo="jumpTo" @toggleDrawer="toggleDrawer"></NavBar>`,
  props: {
    drawerAllowed: {
      default: boolean('drawerAllowed', true)
    }
  },
  methods: {
    jumpTo: action('jumpTo'),
    toggleDrawer: action('toggleDrawer')
  }
})

export { _NavBar }