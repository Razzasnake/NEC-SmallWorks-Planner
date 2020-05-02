import Examples from './Examples.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Examples,
  title: 'Examples|Examples'
}

const _Examples = () => ({
  components: { Examples },
  template: `
    <Examples
      @finish="finish"
    ></Examples>`,
  props: {
  },
  methods: {
    finish: action('finish')
  }
})

export { _Examples }