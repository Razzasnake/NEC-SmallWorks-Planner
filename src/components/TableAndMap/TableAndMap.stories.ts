import TableAndMap from './TableAndMap.vue'
import { action } from '@storybook/addon-actions'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import state, { updateUploadedFile } from '@/store/exploreStore'

export default {
  title: 'TableAndMap/TableAndMap',
  component: TableAndMap
}

updateUploadedFile(uploadedFileGenerator())

const _TableAndMap = () => ({
  components: { TableAndMap },
  template:
    `<div style="height: 100vh">
      <TableAndMap
        :uploadedFile="uploadedFile"
        :filters="filters"
        :sorting="sorting"
        :overlayEventJsons="overlayEventJsons"
        :tableLogic="tableLogic"
        :viewOptions="viewOptions"
        @update-overlay-event-jsons="updateOverlayEventJsons"
        @sort-changed="sortChanged"
        @filter-changed="filterChanged"
      ></TableAndMap>
    </div>`,
  props: {
    uploadedFile: {
      default: state.uploadedFile
    },
    filters: {
      default: []
    },
    sorting: {
      default: []
    },
    tableLogic: {
      default: state.tableLogic
    },
    viewOptions: {
      default: ['table:footer:min', 'table:footer:max', 'table:footer:avg', 'table:footer:total']
    }
  },
  data() {
    return {
      overlayEventJsons: []
    }
  },
  methods: {
    updateOverlayEventJsons(newJsons: any) {
      (this as any).$data.overlayEventJsons = newJsons
    },
    sortChanged: action('sortChanged'),
    filterChanged: action('filterChanged')
  }
})

export { _TableAndMap }