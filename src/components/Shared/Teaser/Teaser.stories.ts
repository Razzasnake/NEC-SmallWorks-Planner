import Teaser from './Teaser.vue'
import { action } from '@storybook/addon-actions'
import { teaserGenerator } from '@/generator/storyblok/TeaserGenerator'

export default {
  component: Teaser,
  title: 'Shared/Teaser'
}

const _Teaser = () => ({
  components: { Teaser },
  template: `
    <Teaser
      :blok="blok"
      @onClick="onClick"
    ></Teaser>`,
  props: {
    blok: {
      default: teaserGenerator()
    }
  },
  methods: {
    onClick: action('onClick')
  }
})

export { _Teaser }