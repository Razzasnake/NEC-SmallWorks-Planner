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
      :inAnalysis="inAnalysis"
      :viewOptions="viewOptions"
      @jumpTo="jumpTo"
      @updateSettings="updateSettings"
    ></NavBar>`,
  props: {
    inAnalysis: {
      default: boolean('inAnalysis', true)
    },
    viewOptions: {
      default: ['table', 'map']
    }
  },
  methods: {
    jumpTo: action('jumpTo'),
    updateSettings: action('updateSettings')
  }
})

export { _NavBar }