import LayerManager from './LayerManager.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: LayerManager,
  title: 'NavBar/LayerManager'
}

const _LayerManager = () => ({
  components: { LayerManager },
  template: '<LayerManager @close="close" />',
  methods: {
    close: action('close')
  }
})

export { _LayerManager }