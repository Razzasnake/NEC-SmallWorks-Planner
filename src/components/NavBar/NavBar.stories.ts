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
      @finish="finish"
      @goHome="goHome"
      @clearFilters="clearFilters"
      @updateViewOptions="updateViewOptions"
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
    finish: action('finish'),
    goHome: action('goHome'),
    clearFilters: action('clearFilters'),
    updateViewOptions: action('updateViewOptions')
  }
})

export { _NavBar }