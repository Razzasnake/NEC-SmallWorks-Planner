import Toolbar from './Toolbar.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Toolbar,
  title: 'TableAndMap|Toolbar'
}

const _Toolbar = () => ({
  components: { Toolbar },
  template: `
    <Toolbar
      :viewOptions="viewOptions"
      @updateViewOptions="updateViewOptions"
    ></Toolbar>`,
  props: {
    viewOptions: {
      default: ['map', 'table']
    }
  },
  methods: {
    updateViewOptions: action('updateViewOptions')
  }
})

export { _Toolbar }