import SignUp from './SignUp.vue'
import state from "@/store/userStore";

state.signUpModalVisible = true

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