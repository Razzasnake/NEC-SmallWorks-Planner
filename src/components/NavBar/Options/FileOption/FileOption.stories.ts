import FileOption from './FileOption.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: FileOption,
  title: 'NavBar|Options/FileOption'
}

const _FileOption = () => ({
  components: { FileOption },
  template: `
    <FileOption
      @clearFilters="clearFilters"
    ></FileOption>`,
  props: {
  },
  methods: {
    clearFilters: action('clearFilters')
  }
})

export { _FileOption }