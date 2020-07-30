import Teaser from './Teaser.vue'
import { action } from '@storybook/addon-actions'
import { teaserGenerator } from '@/generator/storyblok/TeaserGenerator'

export default {
  component: Teaser,
  title: 'Features|Page/Teaser'
}

const _Teaser = () => ({
  components: { Teaser },
  template: `
    <Teaser
      :blok="blok"
      @learnMore="learnMore"
    ></Teaser>`,
  props: {
    blok: {
      default: teaserGenerator()
    }
  },
  methods: {
    learnMore: action('learnMore')
  }
})

export { _Teaser }