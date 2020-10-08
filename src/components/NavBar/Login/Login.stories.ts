import Login from './Login.vue'

export default {
  component: Login,
  title: 'Navbar/Login'
}

const _Login = () => ({
  components: { Login },
  template: '<Login />'
})

export { _Login }