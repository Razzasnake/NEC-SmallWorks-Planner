import Page from './Page.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Page,
  title: 'Examples/Page'
}

const _Page = () => ({
  components: { Page },
  template: '<Page @preview="preview" @finish="finish" />',
  methods: {
    preview: action('preview'),
    finish: action('finish')
  }
})

export { _Page }