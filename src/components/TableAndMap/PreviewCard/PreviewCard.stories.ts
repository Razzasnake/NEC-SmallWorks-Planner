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
        :uploadedFile="uploadedFile"
        :clickedMarker="clickedMarker"
        @close="close"
      ></PreviewCard>
    </div>`,
  props: {
    uploadedFile: {
      default: uploadedFile
    },
    clickedMarker: {
      default: uploadedFile.data[1]
    }
  },
  methods: {
    close: action('close')
  }
})

export { _PreviewCard }