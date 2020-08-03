import GoogleMap from './GoogleMap.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import state, { updateUploadedFile } from '@/store/exploreStore'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

export default {
  title: 'TableAndMap|GoogleMap',
  component: GoogleMap,
}

updateUploadedFile(uploadedFileGenerator())

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
        :displayHeatmap="displayHeatmap"
        :displayMarkers="displayMarkers"
        :displayClusters="displayClusters"
        @markerSelected="markerSelected"
        @updateOverlayEvents="updateOverlayEvents"
      ></GoogleMap>
    </div>`,
  props: {
    uploadedFile: {
      default: state.uploadedFile
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
    },
    displayHeatmap: {
      default: boolean('displayHeatmap', false)
    },
    displayMarkers: {
      default: boolean('displayMarkers', true)
    },
    displayClusters: {
      default: boolean('displayClusters', false)
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