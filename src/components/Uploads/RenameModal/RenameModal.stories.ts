import RenameModal from './RenameModal.vue'
import { action } from '@storybook/addon-actions'

export default {
  component: RenameModal,
  title: 'Uploads/RenameModal'
}

const _RenameModal = () => ({
  components: { RenameModal },
  template: `
    <RenameModal
      :name="name"
      @confirm="confirm"
      @cancel="cancel"
    />`,
  props: {
    name: {
      default: 'test.fdsa.csv'
    }
  },
  methods: {
    confirm: action('confirm'),
    cancel: action('cancel')
  }
})

export { _RenameModal }