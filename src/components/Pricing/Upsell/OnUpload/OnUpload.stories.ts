import OnUpload from './OnUpload.vue'

export default {
  component: OnUpload,
  title: 'Pricing/Upsell/OnUpload'
}

const _OnUpload = () => ({
  components: { OnUpload },
  template: '<OnUpload />'
})

export { _OnUpload }