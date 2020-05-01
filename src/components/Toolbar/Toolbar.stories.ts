import Toolbar from './Toolbar.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Toolbar,
  title: 'Toolbar/Toolbar'
}

const _Toolbar = () => ({
  components: { Toolbar },
  template: `
    <Toolbar
      :viewOptions="viewOptions"
      @updateViewOptions="updateViewOptions"
      @clearFilters="clearFilters"
    ></Toolbar>`,
  props: {
    viewOptions: {
      default: ['map', 'table']
    }
  },
  methods: {
    updateViewOptions: action('updateViewOptions'),
    clearFilters: action('clearFilters')
  }
})

export { _Toolbar }