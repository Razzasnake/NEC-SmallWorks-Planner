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
      @row-clicked="rowClicked"
      @share="share"
      @get-link="getLink"
      @rename="rename"
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
    remove: action('remove')
  }
})

export { _Table }