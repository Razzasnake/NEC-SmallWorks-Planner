import GoogleMap from './GoogleMap.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  title: 'TableAndMap|GoogleMap',
  component: GoogleMap,
}

const _GoogleMap = () => ({
  components: { GoogleMap },
  template:
    `<div style="height: 100vh">
      <GoogleMap
        :uploadedFile="uploadedFile"
        :hiddenMarkerIndices="hiddenMarkerIndices"
        :overlayEvents="overlayEvents"
        :createInfoWindow="createInfoWindow"
        :clickedMarker="clickedMarker"
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
    createInfoWindow: {
      default: () => {
        return null
      }
    },
    clickedMarker: {
      default: null
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