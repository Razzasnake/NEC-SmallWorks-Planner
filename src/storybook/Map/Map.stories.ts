import Map from './Map.vue'

export default {
  component: Map,
  title: 'Map'
}

const _Map = () => ({
  components: { Map },
  template:
    `<Map></Map>`
})

export { _Map }
