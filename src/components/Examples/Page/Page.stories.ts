import Page from './Page.vue'
import { action } from '@storybook/addon-actions'
import { pageGenerator } from '@/generator/storyblok/PageGenerator'

export default {
  component: Page,
  title: 'Examples/Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page
      :blok="blok"
      @preview="preview"
    ></Page>`,
  props: {
    blok: {
      default: pageGenerator(true)
    }
  },
  methods: {
    preview: action('preview')
  }
})

export { _Page }