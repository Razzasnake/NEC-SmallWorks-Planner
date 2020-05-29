import Home from './Home.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Home,
  title: 'Home|Home'
}

const _Home = () => ({
  components: { Home },
  template: `
    <Home
      @finish="finish"
    ></Home>`,
  methods: {
    finish: action('finish')
  }
})

export { _Home }