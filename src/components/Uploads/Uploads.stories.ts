import Uploads from './Uploads.vue'
import GoogleFileGenerator from '@/generator/GoogleFileGenerator'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  component: Uploads,
  title: 'Uploads/Uploads'
}

const _Uploads = () => ({
  components: { Uploads },
  template: `
    <Uploads
      :files="filesProp"
      :tableLoading="tableLoading"
      @row-clicked="rowClicked"
      @update-shared="updateShared"
      @rename="rename"
      @remove="remove"
      @finish="finish"
    ></Uploads>`,
  props: {
    filesProp: {
      default: [
        GoogleFileGenerator(),
        GoogleFileGenerator(),
        GoogleFileGenerator(),
        GoogleFileGenerator(),
        GoogleFileGenerator()
      ]
    },
    tableLoading: {
      default: boolean('tableLoading', false)
    }
  },
  methods: {
    rowClicked: action('rowClicked'),
    updateShared: action('updateShared'),
    rename: action('rename'),
    remove: action('remove'),
    finish: action('finish')
  }
})

export { _Uploads }