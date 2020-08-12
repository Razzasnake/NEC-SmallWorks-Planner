import Loading from './Loading.vue'
import { number, text } from '@storybook/addon-knobs'

export default {
  component: Loading,
  title: 'Shared|Loading'
}

const _Loading = () => ({
  components: { Loading },
  template: `
    <Loading
      :max="max"
      :value="value"
      :label="label"
      :loading="true"
    ></Loading>`,
  props: {
    max: {
      default: number('max', 100)
    },
    value: {
      default: number('value', 42)
    },
    label: {
      default: text('label', 'Geocoding')
    }
  },
  methods: {
  }
})

export { _Loading }