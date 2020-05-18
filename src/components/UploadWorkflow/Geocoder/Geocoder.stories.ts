import Geocoder from './Geocoder.vue'

export default {
  component: Geocoder,
  title: 'Home|Geocoder'
}

const _Geocoder = () => ({
  components: { Geocoder },
  template: `
    <Geocoder></Geocoder>`,
  methods: {
  }
})

export { _Geocoder }