import GoogleMap from './GoogleMap.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  title: 'TableAndMap|GoogleMap',
  component: GoogleMap,
}

const uploadedFile = uploadedFileGenerator(100)

const _GoogleMap = () => ({
  components: { GoogleMap },
  template:
    `<div style="height: 100vh">
      <GoogleMap
        :rowData="rowData"
        :hiddenMarkerIndices="hiddenMarkerIndices"
        :selectedMarkerIndices="selectedMarkerIndices"
        :overlayEvents="overlayEvents"
        :summary="summary"
        :createInfoWindow="createInfoWindow"
        :allowDraw="allowDraw"
        @markerSelected="markerSelected"
        @updateOverlayEvents="updateOverlayEvents"
      ></GoogleMap>
    </div>`,
  props: {
    rowData: {
      default: uploadedFile.data.slice(uploadedFile.firstRowHeader ? 1 : 0)
    },
    hiddenMarkerIndices: {
      default: new Set()
    },
    selectedMarkerIndices: {
      default: new Set()
    },
    summary: {
      default: []
    },
    createInfoWindow: {
      default: () => {
        return null
      }
    },
    allowDraw: {
      default: true
    }
  },
  data() {
    return {
      overlayEvents: []
    }
  },
  methods: {
    markerSelected: action('markerSelected'),
    updateOverlayEvents: action('updateOverlayEvents')
  }
})

export { _GoogleMap }