import ViewOption from './ViewOption.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: ViewOption,
  title: 'Toolbar|Options/ViewOption'
}

const _ViewOption = () => ({
  components: { ViewOption },
  template: `
    <ViewOption
      :viewOptions="viewOptionOptions"
      @updateViewOptions="updateViewOptions"
    ></ViewOption>`,
  props: {
    viewOptionOptions: {
      default: ['map', 'table']
    }
  },
  methods: {
    updateViewOptions: action('updateViewOptions')
  }
})

export { _ViewOption }