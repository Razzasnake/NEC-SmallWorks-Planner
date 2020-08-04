import Status404 from './Status404.vue'

export default {
  component: Status404,
  title: 'Shared|Status404'
}

const _Status404 = () => ({
  components: { Status404 },
  template: '<Status404 :countdown="countdown" />',
  props: {
    countdown: {
      default: 30
    }
  }
})

export { _Status404 }