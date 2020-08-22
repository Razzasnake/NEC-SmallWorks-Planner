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
        :map="map"
        :tableLogic="tableLogic"
        :viewOptions="viewOptions"
        @updateOverlayEventJsons="updateOverlayEventJsons"
        @sortChanged="sortChanged"
        @filterChanged="filterChanged"
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
      map: {
        overlayEventJsons: [],
        infoWindowKeys: []
      }
    }
  },
  methods: {
    updateOverlayEventJsons(newJsons: any) {
      (this as any).$data.map.overlayEventJsons = newJsons
    },
    sortChanged: action('sortChanged'),
    filterChanged: action('filterChanged')
  }
})

export { _TableAndMap }