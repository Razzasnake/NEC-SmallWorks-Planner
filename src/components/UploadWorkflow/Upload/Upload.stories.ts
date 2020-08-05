import Upload from './Upload.vue'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'

export default {
  component: Upload,
  title: 'Upload Workflow|Upload'
}

const _Upload = () => ({
  components: { Upload },
  template: `
    <Upload
      :color="color"
      @fileUploaded="fileUploaded"
    ></Upload>`,
  props: {
    color: {
      default: text('color', '#eeeeee')
    }
  },
  methods: {
    fileUploaded: action('fileUploaded')
  }
})

export { _Upload }