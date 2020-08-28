import LayerManager from './LayerManager.vue'

export default {
  component: LayerManager,
  title: 'NavBar/LayerManager'
}

const _LayerManager = () => ({
  components: { LayerManager },
  template: '<LayerManager />',
  props: {
  },
  methods: {
  }
})

export { _LayerManager }