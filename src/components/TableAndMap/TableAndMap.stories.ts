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
        :uploaded-file="uploadedFile"
        :filters="filters"
        :sorting="sorting"
        :overlay-event-jsons="overlayEventJsons"
        :table-logic="tableLogic"
        :view-options="viewOptions"
        :layers="layers"
        :is-paid-tier="isPaidTier"
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
      default: ["map", "map:markers", "table", "table:footer", "table:footer:avg"]
    },
    layers: {
      default: []
    },
    isPaidTier: {
      default: true
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