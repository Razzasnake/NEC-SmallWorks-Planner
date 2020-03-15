import SelectColumns from './SelectColumns.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: SelectColumns,
  title: 'Upload Workflow|SelectColumns'
}

const _SelectColumns = () => ({
  components: { SelectColumns },
  template: `
    <SelectColumns
      :value="value"
      :columnSelections="columnSelections"
      @updateSelections="updateSelections"
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
    }
  },
  methods: {
    updateSelections: action('updateSelections')
  }
})

export { _SelectColumns }