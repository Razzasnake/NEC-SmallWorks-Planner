import EmbedCode from './EmbedCode.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: EmbedCode,
  title: 'NavBar/EmbedCode'
}

const _EmbedCode = () => ({
  components: { EmbedCode },
  template: '<EmbedCode @close="close" />',
  methods: {
    close: action('close')
  }
})

export { _EmbedCode }