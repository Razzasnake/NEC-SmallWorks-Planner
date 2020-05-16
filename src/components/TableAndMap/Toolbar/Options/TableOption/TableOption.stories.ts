import TableOption from './TableOption.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: TableOption,
  title: 'TableAndMap|Toolbar/Options/TableOption'
}

const _TableOption = () => ({
  components: { TableOption },
  template: `
    <TableOption
      :tableOptions="tableOptions"
      @updateTableOptions="updateTableOptions"
    ></TableOption>`,
  props: {
    tableOptions: {
      default: ['table']
    }
  },
  methods: {
    updateTableOptions: action('updateTableOptions')
  }
})

export { _TableOption }