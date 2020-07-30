import Feature from './Feature.vue'
import { featureGenerator } from '@/generator/storyblok/FeatureGenerator'

export default {
  component: Feature,
  title: 'Features|Feature'
}

const _Feature = () => ({
  components: { Feature },
  template: `
    <Feature
      :blok="blok"
    ></Feature>`,
  props: {
    blok: {
      default: featureGenerator()
    }
  }
})

export { _Feature }