import Feature from './Feature.vue'
import { features } from '@/entities/data'
import { action } from '@storybook/addon-actions'

export default {
  component: Feature,
  title: 'Features/Feature'
}

const _Feature = () => ({
  components: { Feature },
  template: `
    <Feature
      :feature="feature"
      @finish="finish"
    ></Feature>`,
  props: {
    feature: {
      default: features[0]
    }
  },
  methods: {
    finish: action('finish')
  }
})

export { _Feature }