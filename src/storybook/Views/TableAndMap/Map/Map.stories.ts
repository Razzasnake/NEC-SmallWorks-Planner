import Map from './Map.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  component: Map,
  title: 'Views|TableAndMap/Map'
}

const _Map = () => ({
  components: { Map },
  template:
    `<Map
      style="height: 100vh;"
      :uploadedFile="uploadedFile"
      @markerClicked="markerClicked"
    ></Map>`,
  props: {
    uploadedFile: {
      default: uploadedFileGenerator()
    }
  },
  methods: {
    markerClicked: action('markerClicked')
  }
})

export { _Map }
