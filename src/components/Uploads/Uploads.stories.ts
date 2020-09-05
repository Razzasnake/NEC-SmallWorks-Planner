import Uploads from './Uploads.vue'
import GoogleFileGenerator from '@/generator/GoogleFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  component: Uploads,
  title: 'Uploads/Uploads'
}

const _Uploads = () => ({
  components: { Uploads },
  template: `
    <Uploads
      :files="filesProp"
    ></Uploads>`,
  props: {
    filesProp: {
      default: [
        GoogleFileGenerator(),
        GoogleFileGenerator(),
        GoogleFileGenerator(),
        GoogleFileGenerator(),
        GoogleFileGenerator()
      ]
    }
  },
  methods: {
    rowClicked: action('rowClicked')
  }
})

export { _Uploads }