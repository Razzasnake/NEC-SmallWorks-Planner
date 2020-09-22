import Page from './Page.vue'
import { text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  component: Page,
  title: 'Shared/Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page :title="title" :subtitle="subtitle" :img="img" @finish="finish">
      <div>Content goes here</div>
    </Page>`,
  props: {
    title: {
      default: text('title', 'Title')
    },
    subtitle: {
      default: text('subtitle', 'Subtitle')
    },
    img: {
      default: require('@/assets/examples/covid19/covid19.jpg')
    }
  },
  methods: {
    finish: action('finish')
  }
})

export { _Page }