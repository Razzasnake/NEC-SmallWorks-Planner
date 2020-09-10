import Login from './Login.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Login,
  title: 'Navbar/Login'
}

const _Login = () => ({
  components: { Login },
  template: '<Login @jumpTo="jumpTo"></Login>',
  methods: {
    jumpTo: action('jumpTo')
  }
})

export { _Login }