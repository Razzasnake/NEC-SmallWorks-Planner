import Loading from './Loading.vue'

export default {
  component: Loading,
  title: 'Shared|Loading'
}

const _Loading = () => ({
  components: { Loading },
  template: `
    <Loading
      :loading="true"
      :text="text"
    ></Loading>`,
  props: {
    text: {
      default: "Text"
    }
  },
  methods: {
  }
})

export { _Loading }