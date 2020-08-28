import ShapeManager from './ShapeManager.vue'

export default {
  component: ShapeManager,
  title: 'NavBar/ShapeManager'
}

const _ShapeManager = () => ({
  components: { ShapeManager },
  template: '<ShapeManager />',
  props: {
  },
  methods: {
  }
})

export { _ShapeManager }