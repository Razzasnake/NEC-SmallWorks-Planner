import TableLogic from './Logic/TableLogic'
import Table from './Table.vue'
import { action } from '@storybook/addon-actions'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'

export default {
  title: 'TableandMap/Table',
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
        :viewOptions="viewOptions"
        :clickedMarker="clickedMarker"
        @sortChanged="sortChanged"
        @filterChanged="filterChanged"
        @hiddenMarkerIndicesChanged="hiddenMarkerIndicesChanged"
        @markerSelected="markerSelected"
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
    },
    viewOptions: {
      default: ['table:footer:min', 'table:footer:max', 'table:footer:avg', 'table:footer:total']
    },
    clickedMarker: {
      default: null
    }
  },
  methods: {
    sortChanged: action('sortChanged'),
    filterChanged: action('filterChanged'),
    hiddenMarkerIndicesChanged: action('hiddenMarkerIndicesChanged'),
    markerSelected: action('markerSelected')
  }
})

export { _Table }