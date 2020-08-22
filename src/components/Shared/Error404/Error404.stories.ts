import Error404 from './Error404.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Error404,
  title: 'Shared/Error404'
}

const _Error404 = () => ({
  components: { Error404 },
  template: '<Error404 :countdown="countdown" @goHome="goHome" />',
  props: {
    countdown: {
      default: 30
    }
  },
  methods: {
    goHome: action('goHome')
  }
})

export { _Error404 }