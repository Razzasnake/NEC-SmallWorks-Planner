import Upload from './Upload.vue'
import { action } from '@storybook/addon-actions'
import { text, boolean } from '@storybook/addon-knobs'

export default {
  component: Upload,
  title: 'Upload Workflow/Upload'
}

const _Upload = () => ({
  components: { Upload },
  template: `
    <Upload
      :color="color"
      :small="small"
      @fileUploaded="fileUploaded"
    ></Upload>`,
  props: {
    color: {
      default: text('color', '#eeeeee')
    },
    small: {
      default: boolean('small', false)
    }
  },
  methods: {
    fileUploaded: action('fileUploaded')
  }
})

export { _Upload }