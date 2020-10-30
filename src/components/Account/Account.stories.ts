import Account from './Account.vue'
import googleUserGenerator from '@/generator/GoogleUserGenerator'
import { number } from '@storybook/addon-knobs'

export default {
  component: Account,
  title: 'Account/Account'
}

const _Account = () => ({
  components: { Account },
  template: '<Account :user="user" :number-files="numberFiles" :tier="tier" />',
  props: {
    user: {
      default: googleUserGenerator()
    },
    numberFiles: {
      default: number('numberFiles', 3)
    },
    tier: {
      default: number('tier', 0)
    }
  }
})

export { _Account }