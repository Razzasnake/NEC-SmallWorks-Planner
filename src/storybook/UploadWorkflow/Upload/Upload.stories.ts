import Upload from './Upload.vue'

export default {
  component: Upload,
  title: 'Upload Workflow|Upload'
}

const _Upload = () => ({
  components: { Upload },
  template: `
    <Upload 
    ></Upload>`,
  props: {
  },
  methods: {
  }
})

export { _Upload }