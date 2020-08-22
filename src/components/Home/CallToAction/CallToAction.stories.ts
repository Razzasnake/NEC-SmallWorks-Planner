import CallToAction from './CallToAction.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: CallToAction,
  title: 'Home/CallToAction'
}

const _CallToAction = () => ({
  components: { CallToAction },
  template: `
    <CallToAction
      @finish="finish"
    ></CallToAction>`,
  methods: {
    finish: action('finish')
  }
})

export { _CallToAction }