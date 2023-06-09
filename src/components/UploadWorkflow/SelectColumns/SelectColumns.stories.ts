import SelectColumns from './SelectColumns.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: SelectColumns,
  title: 'Upload Workflow/SelectColumns'
}

const _SelectColumns = () => ({
  components: { SelectColumns },
  template: `
    <SelectColumns
      :value="value"
      :column-selections="columnSelections"
      :first-row-header="firstRowHeader"
      @update-selections="updateSelections"
      @update-first-row-header="updateFirstRowHeader"
      @update-is-complete="updateIsComplete"
    ></SelectColumns>`,
  props: {
    value: {
      default: [
        ['lat', 'lon', 'address'],
        [42.01957, -87.85667, '2400 Irwin Ave']
      ]
    },
    columnSelections: {
      default: {
        lat: 0,
        lng: 1,
        address: null,
        city: null,
        state: null,
        zip: null
      }
    },
    firstRowHeader: {
      default: true
    }
  },
  methods: {
    updateSelections: action('updateSelections'),
    updateFirstRowHeader: action('updateFirstRowHeader'),
    updateIsComplete: action('updateIsComplete')
  }
})

export { _SelectColumns }