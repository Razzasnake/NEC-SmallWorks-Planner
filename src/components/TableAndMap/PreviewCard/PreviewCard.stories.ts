import PreviewCard from './PreviewCard.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  title: 'TableAndMap/PreviewCard',
  component: PreviewCard
}

const uploadedFile = uploadedFileGenerator()

const _PreviewCard = () => ({
  components: { PreviewCard },
  template:
    `<div style="height: 100vh">
      <PreviewCard
        :uploaded-file="uploadedFile"
        :clicked-marker="clickedMarker"
        :layers="layers"
        @close="close"
      ></PreviewCard>
    </div>`,
  props: {
    uploadedFile: {
      default: uploadedFile
    },
    clickedMarker: {
      default: uploadedFile.data[1]
    },
    layers: {
      default: []
    }
  },
  methods: {
    close: action('close')
  }
})

export { _PreviewCard }