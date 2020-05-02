import Tile from './Tile.vue'
import { action } from '@storybook/addon-actions'
import { exampleAnalysisGenerator } from '@/generator/ExampleAnalysisGenerator'

export default {
  component: Tile,
  title: 'Examples|Tile'
}

const _Tile = () => ({
  components: { Tile },
  template: `
    <Tile
      :exampleAnalysis="exampleAnalysis"
      @preview="preview"
    ></Tile>`,
  props: {
    exampleAnalysis: {
      default: exampleAnalysisGenerator()
    }
  },
  methods: {
    preview: action('preview')
  }
})

export { _Tile }