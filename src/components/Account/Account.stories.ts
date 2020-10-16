import Account from './Account.vue'
import googleUserGenerator from '@/generator/GoogleUserGenerator'
import state from '@/store/driveStore'

state.tier = 0

export default {
  component: Account,
  title: 'Account/Account'
}

const _Account = () => ({
  components: { Account },
  template: '<Account :user="user" />',
  props: {
    user: {
      default: googleUserGenerator()
    }
  }
})

export { _Account }