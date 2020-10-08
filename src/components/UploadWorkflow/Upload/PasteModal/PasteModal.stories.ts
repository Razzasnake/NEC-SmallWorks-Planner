import PasteModal from './PasteModal.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: PasteModal,
  title: 'Upload Workflow/Upload/PasteModal'
}

const _PasteModal = () => ({
  components: { PasteModal },
  template: `
    <PasteModal
      @upload-text="uploadText"
      @close-modal="closeModal"
    ></PasteModal>`,
  props: {
  },
  methods: {
    uploadText: action('uploadText'),
    closeModal: action('closeModal')
  }
})

export { _PasteModal }