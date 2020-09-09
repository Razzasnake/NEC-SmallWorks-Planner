import Error404 from './Error404.vue'

export default {
  component: Error404,
  title: 'Shared/Error404'
}

const _Error404 = () => ({
  components: { Error404 },
  template: '<Error404 :countdown="countdown" />',
  props: {
    countdown: {
      default: 30
    }
  },
})

export { _Error404 }