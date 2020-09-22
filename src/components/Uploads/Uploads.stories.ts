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
      @rowClicked="rowClicked"
      @share="share"
      @getLink="getLink"
      @rename="rename"
      @download="download"
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
    share: action('share'),
    getLink: action('getLink'),
    rename: action('rename'),
    download: action('download'),
    remove: action('remove'),
    finish: action('finish')
  }
})

export { _Uploads }