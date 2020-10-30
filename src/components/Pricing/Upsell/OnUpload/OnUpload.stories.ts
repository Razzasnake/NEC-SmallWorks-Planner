import OnUpload from './OnUpload.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: OnUpload,
  title: 'Pricing/Upsell/OnUpload'
}

const _OnUpload = () => ({
  components: { OnUpload },
  template: '<OnUpload @close="close" />',
  methods: {
    close: action('close')
  }
})

export { _OnUpload }