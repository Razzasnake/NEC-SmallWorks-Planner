import Account from './Account.vue'
import state from '@/store/driveStore'

export default {
  component: Account,
  title: 'Account/Account'
}

const _Account = () => ({
  components: { Account },
  template: '<Account :user="user" />',
  props: {
    user: {
      default: state.user
    }
  }
})

export { _Account }