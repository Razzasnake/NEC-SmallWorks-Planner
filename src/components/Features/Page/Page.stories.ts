import Page from './Page.vue'
import { action } from '@storybook/addon-actions'
import { pageGenerator } from '@/generator/storyblok/PageGenerator'

export default {
  component: Page,
  title: 'Features|Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page
      :blok="blok"
      @learnMore="learnMore"
    ></Page>`,
  props: {
    blok: {
      default: pageGenerator()
    }
  },
  methods: {
    learnMore: action('learnMore')
  }
})

export { _Page }