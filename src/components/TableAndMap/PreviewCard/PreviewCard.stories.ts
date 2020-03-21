import PreviewCard from './PreviewCard.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  title: 'TableAndMap|PreviewCard',
  component: PreviewCard
}

const _PreviewCard = () => ({
  components: { PreviewCard },
  template:
    `<div style="height: 100vh">
      <PreviewCard
        :clickedMarker="clickedMarker"
        @select="select"
        @deselect="deselect"
        @close="close"
      ></PreviewCard>
    </div>`,
  props: {
    clickedMarker: {
      default: uploadedFileGenerator().data[0]
    }
  },
  methods: {
    select: action('select'),
    deselect: action('deselect'),
    close: action('close')
  }
})

export { _PreviewCard }