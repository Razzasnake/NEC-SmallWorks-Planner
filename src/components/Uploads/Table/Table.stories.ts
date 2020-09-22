import Table from './Table.vue'
import GoogleFileGenerator from '@/generator/GoogleFileGenerator'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  component: Table,
  title: 'Uploads/Table'
}

const _Table = () => ({
  components: { Table },
  template: `
    <Table
      :files="filesProp"
      :tableLoading="tableLoading"
      @rowClicked="rowClicked"
      @share="share"
      @getLink="getLink"
      @rename="rename"
      @download="download"
      @remove="remove"
    ></Table>`,
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
    remove: action('remove')
  }
})

export { _Table }