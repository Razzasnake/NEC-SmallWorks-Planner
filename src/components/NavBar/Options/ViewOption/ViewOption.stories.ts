import ViewOption from './ViewOption.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: ViewOption,
  title: 'NavBar|Options/ViewOption'
}

const _ViewOption = () => ({
  components: { ViewOption },
  template: `
    <ViewOption
      :viewOptions="viewOptions"
      @updateViewOptions="updateViewOptions"
    ></ViewOption>`,
  props: {
    viewOptions: {
      default: ['map', 'table']
    }
  },
  methods: {
    updateViewOptions: action('updateViewOptions')
  }
})

export { _ViewOption }