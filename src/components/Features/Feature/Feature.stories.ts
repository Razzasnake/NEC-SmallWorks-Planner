import Feature from './Feature.vue'
import { featureGenerator } from '@/generator/storyblok/FeatureGenerator'
import { action } from '@storybook/addon-actions'

export default {
  component: Feature,
  title: 'Features/Feature'
}

const _Feature = () => ({
  components: { Feature },
  template: `
    <Feature
      :blok="blok"
      @finish="finish"
    ></Feature>`,
  props: {
    blok: {
      default: featureGenerator()
    }
  },
  methods: {
    finish: action('finish')
  }
})

export { _Feature }