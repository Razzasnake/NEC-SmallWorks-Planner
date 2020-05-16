import MapOption from './MapOption.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: MapOption,
  title: 'TableAndMap|Toolbar/Options/MapOption'
}

const _MapOption = () => ({
  components: { MapOption },
  template: `
    <MapOption
      :mapOptions="mapOptions"
      @updateMapOptions="updateMapOptions"
    ></MapOption>`,
  props: {
    mapOptions: {
      default: ['map']
    }
  },
  methods: {
    updateMapOptions: action('updateMapOptions')
  }
})

export { _MapOption }