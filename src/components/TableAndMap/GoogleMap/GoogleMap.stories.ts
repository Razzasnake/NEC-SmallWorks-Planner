import GoogleMap from './GoogleMap.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import state, { updateUploadedFile } from '@/store/exploreStore'
import { action } from '@storybook/addon-actions'
import { boolean, number } from '@storybook/addon-knobs'

export default {
  title: 'TableAndMap/GoogleMap',
  component: GoogleMap,
}

updateUploadedFile(uploadedFileGenerator())

const _GoogleMap = () => ({
  components: { GoogleMap },
  template:
    `<div style="height: 100vh">
      <GoogleMap
        :uploaded-file="uploadedFile"
        :hidden-marker-indices="hiddenMarkerIndices"
        :overlay-events="overlayEvents"
        :create-info-window="createInfoWindow"
        :clicked-marker="clickedMarker"
        :display-heatmap="displayHeatmap"
        :display-markers="displayMarkers"
        :display-clusters="displayClusters"
        :group-by-key="groupByKey"
        :unselected-marker-opacity="unselectedMarkerOpacity"
        :layers="layers"
        @marker-selected="markerSelected"
        @update-overlay-events="updateOverlayEvents"
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
    },
    groupByKey: {
      default: number('groupByKey', 2)
    },
    unselectedMarkerOpacity: {
      default: number('unselectedMarkerOpacity', 0)
    },
    layers: {
      default: state.layers
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