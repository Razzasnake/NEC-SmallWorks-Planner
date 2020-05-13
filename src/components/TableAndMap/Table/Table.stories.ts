import TableLogic from './TableLogic'
import Table from './Table.vue'
import { action } from '@storybook/addon-actions'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'

export default {
  title: 'TableandMap|Table',
  component: Table
}

const uploadedFile = uploadedFileGenerator()

const _Table = () => ({
  components: { Table },
  template:
    `<div style="height: 100vh">
      <Table
        :rowData="rowData"
        :filters="filters"
        :sorting="sorting"
        :tableLogic="tableLogic"
        :overlayEvents="overlayEvents"
        @sortChanged="sortChanged"
        @filterChanged="filterChanged"
        @hiddenMarkerIndicesChanged="hiddenMarkerIndicesChanged"
      ></Table>
    </div>`,
  props: {
    rowData: {
      default: uploadedFile.data.slice(uploadedFile.firstRowHeader ? 1 : 0)
    },
    filters: {
      default: []
    },
    sorting: {
      default: []
    },
    tableLogic: {
      default: new TableLogic(uploadedFile)
    },
    overlayEvents: {
      default: []
    }
  },
  methods: {
    sortChanged: action('sortChanged'),
    filterChanged: action('filterChanged'),
    hiddenMarkerIndicesChanged: action('hiddenMarkerIndicesChanged')
  }
})

export { _Table }