import Login from './Login.vue'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  component: Login,
  title: 'Navbar/Login'
}

const _Login = () => ({
  components: { Login },
  template: '<Login :mobile="mobile" @jumpTo="jumpTo"></Login>',
  props: {
    mobile: {
      default: boolean('mobile', false)
    }
  },
  methods: {
    jumpTo: action('jumpTo')
  }
})

export { _Login }