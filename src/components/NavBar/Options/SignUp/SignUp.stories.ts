import SignUp from './SignUp.vue'

export default {
  component: SignUp,
  title: 'NavBar|Options/SignUp'
}

const _SignUp = () => ({
  components: { SignUp },
  template: `
    <SignUp />`,
  props: {
  },
  methods: {
  }
})

export { _SignUp }