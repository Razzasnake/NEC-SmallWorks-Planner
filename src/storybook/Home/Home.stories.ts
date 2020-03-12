import Home from './Home.vue'

export default {
  component: Home,
  title: 'Home|Home'
}

const _Home = () => ({
  components: { Home },
  template: `
    <Home 
    ></Home>`,
  props: {
  },
  methods: {
  }
})

export { _Home }