import Navigation from './Navigation.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Navigation,
  title: 'Uploads/Navigation'
}

const _Navigation = () => ({
  components: { Navigation },
  template: '<Navigation @finish="finish" />',
  methods: {
    finish: action('finish')
  }
})

export { _Navigation }