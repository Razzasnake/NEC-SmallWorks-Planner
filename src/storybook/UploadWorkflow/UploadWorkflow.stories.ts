import UploadWorkflow from './UploadWorkflow.vue'

export default {
  component: UploadWorkflow,
  title: 'Upload Workflow|UploadWorkflow'
}

const _UploadWorkflow = () => ({
  components: { UploadWorkflow },
  template: `
    <UploadWorkflow 
    ></UploadWorkflow>`,
  props: {
  },
  methods: {
  }
})

export { _UploadWorkflow }