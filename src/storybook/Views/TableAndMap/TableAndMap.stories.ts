import TableLogic from './TableLogic'
import TableAndMap from './TableAndMap.vue'
import { action } from '@storybook/addon-actions'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import UploadedFile from '@/entities/UploadedFile'

export default {
  title: 'Views|TableAndMap',
  component: TableAndMap
}

const uploadedFile = uploadedFileGenerator()

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
        @updateOverlayEventJsons="updateOverlayEventJsons"
        @rowSelectionsChanged="rowSelectionsChanged"
        @sortChanged="sortChanged"
        @filterChanged="filterChanged"
      >
        <div slot="preview" class="card entity-preview">
          Preview Here!
        </div>
      </TableAndMap>
    </div>`,
  props: {
    uploadedFile: {
      default: uploadedFile
    },
    filters: {
      default: []
    },
    sorting: {
      default: []
    },
    tableLogic: {
      default: new TableLogic(uploadedFile)
    }
  },
  data() {
    return {
      map: {
        summary: [],
        overlayEventJsons: [],
        infoWindowKeys: [],
        allowDraw: true
      }
    }
  },
  methods: {
    updateOverlayEventJsons(newJsons) {
      (this as any).$data.map.overlayEventJsons = newJsons
    },
    rowSelectionsChanged: action('rowSelectionsChanged'),
    sortChanged: action('sortChanged'),
    filterChanged: action('filterChanged')
  }
})

export { _TableAndMap }