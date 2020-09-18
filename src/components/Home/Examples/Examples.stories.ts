import Examples from './Examples.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Examples,
  title: 'Home/Examples'
}

const _Examples = () => ({
  components: { Examples },
  template: `
    <Examples
      @preview="preview"
    ></Examples>`,
  methods: {
    preview: action('preview')
  }
})

export { _Examples }