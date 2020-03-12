import NavBar from './NavBar.vue'

export default {
  component: NavBar,
  title: 'NavBar|NavBar'
}

const _NavBar = () => ({
  components: { NavBar },
  template: `
    <NavBar 
    ></NavBar>`,
  props: {
  },
  methods: {
  }
})

export { _NavBar }