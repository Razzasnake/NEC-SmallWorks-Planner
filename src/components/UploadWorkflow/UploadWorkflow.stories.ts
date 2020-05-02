import UploadWorkflow from './UploadWorkflow.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: UploadWorkflow,
  title: 'Upload Workflow|UploadWorkflow'
}

const _UploadWorkflow = () => ({
  components: { UploadWorkflow },
  template: `
    <UploadWorkflow
      @finish="finish"
      @closeModal="closeModal"
    ></UploadWorkflow>`,
  props: {
  },
  methods: {
    finish: action('finish'),
    closeModal: action('closeModal')
  }
})

export { _UploadWorkflow }