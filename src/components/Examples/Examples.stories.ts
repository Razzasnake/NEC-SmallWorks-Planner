import Examples from './Examples.vue'
import { action } from '@storybook/addon-actions'
import { exampleAnalysesGenerator } from '@/generator/ExampleAnalysisGenerator'

export default {
  component: Examples,
  title: 'Examples|Examples'
}

const _Examples = () => ({
  components: { Examples },
  template: `
    <Examples
      :exampleAnalyses="exampleAnalyses"
      @preview="preview"
    ></Examples>`,
  props: {
    exampleAnalyses: {
      default: exampleAnalysesGenerator()
    }
  },
  methods: {
    preview: action('preview')
  }
})

export { _Examples }