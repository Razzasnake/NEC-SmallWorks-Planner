import DoubleClickEditText from './DoubleClickEditText.vue'

export default {
  component: DoubleClickEditText,
  title: 'Shared/DoubleClickEditText'
}

const _DoubleClickEditText = () => ({
  components: { DoubleClickEditText },
  template: '<DoubleClickEditText v-model="text" />',
  props: {
    text: {
      default: "Test"
    }
  },
})

export { _DoubleClickEditText }