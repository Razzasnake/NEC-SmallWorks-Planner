import Features from './Features.vue'

export default {
  component: Features,
  title: 'Home/Features'
}

const _Features = () => ({
  components: { Features },
  template: '<Features />'
})

export { _Features }