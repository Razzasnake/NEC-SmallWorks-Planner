import Page from './Page.vue'
import { pageGenerator } from '@/generator/storyblok/PageGenerator'

export default {
  component: Page,
  title: 'Features/Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page
      :blok="blok"
    ></Page>`,
  props: {
    blok: {
      default: pageGenerator()
    }
  },
})

export { _Page }