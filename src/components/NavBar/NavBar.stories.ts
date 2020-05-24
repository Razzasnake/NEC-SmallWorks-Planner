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
    <NavBar @jumpTo="jumpTo"></NavBar>`,
  props: {
  },
  methods: {
    jumpTo: action('jumpTo')
  }
})

export { _NavBar }