import Geocoder from './Geocoder.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Geocoder,
  title: 'Home|Geocoder'
}

const _Geocoder = () => ({
  components: { Geocoder },
  template: `
    <Geocoder
      :addresses="addresses"
      @updateLocation="updateLocation"
    ></Geocoder>`,
  props: {
    addresses: {
      default: ["111 W Wacker Dr, Chicago, IL 60601"]
    }
  },
  methods: {
    updateLocation: action('updateLocation')
  }
})

export { _Geocoder }