import UploadWorkflow from './UploadWorkflow.vue'
import { action } from '@storybook/addon-actions'
import { text, boolean } from '@storybook/addon-knobs'

export default {
  component: UploadWorkflow,
  title: 'Upload Workflow/UploadWorkflow'
}

const _UploadWorkflow = () => ({
  components: { UploadWorkflow },
  template: `
    <UploadWorkflow
      :color="color"
      :small="small"
      @finish="finish"
    ></UploadWorkflow>`,
  props: {
    color: {
      default: text('color', '#eeeeee')
    },
    small: {
      default: boolean('small', false)
    }
  },
  methods: {
    finish: action('finish')
  }
})

export { _UploadWorkflow }