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
      :table-loading="tableLoading"
      :folder-id="folderId"
      @row-clicked="rowClicked"
      @update-shared="updateShared"
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
    },
    folderId: {
      default: null
    }
  },
  methods: {
    rowClicked: action('rowClicked'),
    updateShared: action('updateShared'),
    rename: action('rename'),
    remove: action('remove')
  }
})

export { _Table }