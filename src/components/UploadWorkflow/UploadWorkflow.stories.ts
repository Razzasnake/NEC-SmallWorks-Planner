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
      @updateLoading="updateLoading"
    ></UploadWorkflow>`,
  props: {
  },
  methods: {
    finish: action('finish'),
    updateLoading: action('updateLoading')
  }
})

export { _UploadWorkflow }