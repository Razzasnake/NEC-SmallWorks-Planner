import Page from './Page.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Page,
  title: 'Examples/Page'
}

const _Page = () => ({
  components: { Page },
  template: '<Page @preview="preview" />',
  methods: {
    preview: action('preview')
  }
})

export { _Page }