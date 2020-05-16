import SignInSignOut from './SignInSignOut.vue'
import state from "@/store/userStore";

state.signInModalVisible = true

export default {
  component: SignInSignOut,
  title: 'NavBar|Options/SignInSignOut'
}

const _SignInSignOut = () => ({
  components: { SignInSignOut },
  template: `
    <SignInSignOut />`,
  props: {
  },
  methods: {
  }
})

export { _SignInSignOut }