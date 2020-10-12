import Page from './Page.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Page,
  title: 'Pricing/Page'
}

const _Page = () => ({
  components: { Page },
  template: '<Page @finish="finish" />',
  methods: {
    finish: action('finish')
  }
})

export { _Page }