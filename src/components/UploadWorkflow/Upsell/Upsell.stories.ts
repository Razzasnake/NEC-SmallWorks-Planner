import Upsell from './Upsell.vue'

export default {
  component: Upsell,
  title: 'Upload Workflow|Upsell'
}

const _Upsell = () => ({
  components: { Upsell },
  template: `
    <Upsell 
    ></Upsell>`,
  props: {
  },
  methods: {
  }
})

export { _Upsell }