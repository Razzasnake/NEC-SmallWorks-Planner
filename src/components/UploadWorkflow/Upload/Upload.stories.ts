import Upload from './Upload.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Upload,
  title: 'Upload Workflow|Upload'
}

const _Upload = () => ({
  components: { Upload },
  template: `
    <Upload
      @fileUploaded="fileUploaded"
    ></Upload>`,
  props: {
  },
  methods: {
    fileUploaded: action('fileUploaded')
  }
})

export { _Upload }