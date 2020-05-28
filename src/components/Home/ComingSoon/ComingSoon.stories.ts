import ComingSoon from './ComingSoon.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: ComingSoon,
  title: 'Home|ComingSoon'
}

const _ComingSoon = () => ({
  components: { ComingSoon },
  template: `
    <ComingSoon
    ></ComingSoon>`,
  methods: {
    finish: action('finish')
  }
})

export { _ComingSoon }