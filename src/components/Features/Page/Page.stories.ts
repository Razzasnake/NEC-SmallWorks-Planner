import Page from './Page.vue'
import { pageGenerator } from '@/generator/storyblok/PageGenerator'
import { action } from '@storybook/addon-actions'

export default {
  component: Page,
  title: 'Features/Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page
      :blok="blok"
      @finish="finish"
    ></Page>`,
  props: {
    blok: {
      default: pageGenerator()
    }
  },
  methods: {
    finish: action('finish')
  }
})

export { _Page }