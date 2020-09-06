import Table from './Table.vue'
import GoogleFileGenerator from '@/generator/GoogleFileGenerator'
import { action } from '@storybook/addon-actions'

export default {
  component: Table,
  title: 'Uploads/Table'
}

const _Table = () => ({
  components: { Table },
  template: `
    <Table
      :files="filesProp"
    ></Table>`,
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

export { _Table }