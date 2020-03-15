import SelectColumns from './SelectColumns.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: SelectColumns,
  title: 'Upload Workflow|steps/SelectColumns'
}

const _SelectColumns = () => ({
  components: { SelectColumns },
  template: `
    <SelectColumns
      :value="value"
      :columnSelections="columnSelections"
      :firstRowHeader="firstRowHeader"
      @updateSelections="updateSelections"
      @updateFirstRowHeader="updateFirstRowHeader"
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
        lat: null,
        lng: null
      }
    },
    firstRowHeader: {
      default: true
    }
  },
  methods: {
    updateSelections: action('updateSelections'),
    updateFirstRowHeader: action('updateFirstRowHeader')
  }
})

export { _SelectColumns }