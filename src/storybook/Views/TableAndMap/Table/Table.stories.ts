import Table from './Table.vue'
import { action } from '@storybook/addon-actions'

import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'

export default {
  component: Table,
  title: 'Views|TableAndMap/Table'
}

const _Table = () => ({
  components: { Table },
  template:
    `<Table
      style="height: 100vh"
      :uploadedFile="uploadedFile"
      :filters="filters"
      :sorting="sorting"
      @sortChanged="sortChanged"
      @filterChanged="filterChanged"
    ></Table>`,
  props: {
    uploadedFile: {
      default: uploadedFileGenerator()
    },
    filters: {
      default: []
    },
    sorting: {
      default: []
    }
  },
  methods: {
    sortChanged: action('sortChanged'),
    filterChanged: action('filterChanged')
  }
})

export { _Table }
