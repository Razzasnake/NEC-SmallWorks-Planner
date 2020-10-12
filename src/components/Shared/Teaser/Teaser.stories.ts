import Teaser from './Teaser.vue'
import { features } from '@/entities/data'

export default {
  component: Teaser,
  title: 'Shared/Teaser'
}

const _Teaser = () => ({
  components: { Teaser },
  template: '<Teaser :blok="blok" />',
  props: {
    blok: {
      default: features[0]
    }
  }
})

export { _Teaser }