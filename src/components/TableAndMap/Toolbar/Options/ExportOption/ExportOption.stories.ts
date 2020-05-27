import ExportOption from './ExportOption.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: ExportOption,
  title: 'TableAndMap|Toolbar/Options/ExportOption'
}

const _ExportOption = () => ({
  components: { ExportOption },
  template: `
    <ExportOption
      @updateExportOptions="updateExportOptions"
    ></ExportOption>`,
  props: {
  },
  methods: {
    updateExportOptions: action('updateExportOptions')
  }
})

export { _ExportOption }