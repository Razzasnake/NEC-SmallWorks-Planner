import GoogleMap from './GoogleMap.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Views/TableAndMap/GoogleMap',
  component: GoogleMap,
}

const _GoogleMap = () => ({
  components: { GoogleMap },
  template:
    `<div style="height: 100vh">
      <GoogleMap
        :uploadedFile="uploadedFile"
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
    uploadedFile: {
      default: uploadedFileGenerator(100)
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