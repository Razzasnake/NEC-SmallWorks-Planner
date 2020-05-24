import Geocoder from './Geocoder.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: Geocoder,
  title: 'Upload Workflow|Geocoder'
}

const _Geocoder = () => ({
  components: { Geocoder },
  template: `
    <Geocoder
      :addresses="addresses"
      @updateLocation="updateLocation"
      @finish="finish"
    ></Geocoder>`,
  props: {
    addresses: {
      default: ["111 W Wacker Dr, Chicago, IL 60601"]
    }
  },
  methods: {
    updateLocation: action('updateLocation'),
    finish: action('finish')
  }
})

export { _Geocoder }