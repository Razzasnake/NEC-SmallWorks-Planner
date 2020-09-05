import UploadsTable from './UploadsTable.vue'
import GoogleFileGenerator from '@/generator/GoogleFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  component: UploadsTable,
  title: 'Uploads/UploadsTable'
}

const _UploadsTable = () => ({
  components: { UploadsTable },
  template: `
    <UploadsTable
      :files="filesProp"
    ></UploadsTable>`,
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

export { _UploadsTable }