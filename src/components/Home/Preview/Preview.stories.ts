import Preview from './Preview.vue'

export default {
  component: Preview,
  title: 'Home|Preview'
}

const _Preview = () => ({
  components: { Preview },
  template: `
    <Preview></Preview>`,
  methods: {
  }
})

export { _Preview }