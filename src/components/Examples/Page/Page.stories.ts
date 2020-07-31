import Page from './Page.vue'
import { action } from '@storybook/addon-actions'
import { exampleAnalysesGenerator } from '@/generator/ExampleAnalysisGenerator'
import { pageGenerator } from '@/generator/storyblok/PageGenerator'

export default {
  component: Page,
  title: 'Examples|Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page
      :blok="blok"
      :exampleAnalyses="exampleAnalyses"
      @preview="preview"
    ></Page>`,
  props: {
    blok: {
      default: pageGenerator()
    },
    exampleAnalyses: {
      default: exampleAnalysesGenerator()
    }
  },
  methods: {
    preview: action('preview')
  }
})

export { _Page }