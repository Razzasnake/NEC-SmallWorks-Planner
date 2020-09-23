import NavBar from './NavBar.vue'
import { boolean } from '@storybook/addon-knobs'

export default {
  component: NavBar,
  title: 'NavBar/NavBar'
}

const _NavBar = () => ({
  components: { NavBar },
  template: `
    <NavBar :drawerAllowed="drawerAllowed"></NavBar>`,
  props: {
    drawerAllowed: {
      default: boolean('drawerAllowed', true)
    }
  }
})

export { _NavBar }