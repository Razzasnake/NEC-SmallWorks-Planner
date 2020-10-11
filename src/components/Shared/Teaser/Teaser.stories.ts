import Teaser from './Teaser.vue'
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
    ></Teaser>`,
  props: {
    blok: {
      default: teaserGenerator()
    }
  }
})

export { _Teaser }