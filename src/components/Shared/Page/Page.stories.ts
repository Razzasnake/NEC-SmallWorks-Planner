import Page from './Page.vue'
import { text } from '@storybook/addon-knobs'

export default {
  component: Page,
  title: 'Shared/Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page :title="title" :subtitle="subtitle" :img="img">
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
  }
})

export { _Page }