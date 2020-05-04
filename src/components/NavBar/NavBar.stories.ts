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
      @goHome="goHome"
      @goExamples="goExamples"
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
    goHome: action('goHome'),
    goExamples: action('goExamples'),
    updateSettings: action('updateSettings')
  }
})

export { _NavBar }