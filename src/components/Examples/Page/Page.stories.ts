import Page from './Page.vue'
import { action } from '@storybook/addon-actions'
import { exampleAnalysesGenerator } from '@/generator/ExampleAnalysisGenerator'

export default {
  component: Page,
  title: 'Examples|Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page
      :exampleAnalyses="exampleAnalyses"
      @preview="preview"
    ></Page>`,
  props: {
    exampleAnalyses: {
      default: exampleAnalysesGenerator()
    }
  },
  methods: {
    preview: action('preview')
  }
})

export { _Page }