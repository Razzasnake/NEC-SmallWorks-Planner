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
      @updateSettings="updateSettings"
    ></FileOption>`,
  props: {
  },
  methods: {
    updateSettings: action('updateSettings')
  }
})

export { _FileOption }