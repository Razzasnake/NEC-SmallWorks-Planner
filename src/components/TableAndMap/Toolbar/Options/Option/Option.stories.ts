import Option from './Option.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Option,
  title: 'TableAndMap|Toolbar/Options/Option'
}

const _Option = () => ({
  components: { Option },
  template: `
    <Option
      :name="name"
      :dropdowns="dropdowns"
      :options="options"
      @updateOptions="updateOptions"
    ></Option>`,
  props: {
    name: {
      default: 'Example Dropdown'
    },
    dropdowns: {
      default: [
        {
          key: 'example:1',
          label: 'Example 1'
        },
        {
          key: 'example:2',
          label: 'Example 2'
        }
      ]
    },
    options: {
      default: ['example:1']
    }
  },
  methods: {
    updateOptions: action('updateOptions')
  }
})

export { _Option }