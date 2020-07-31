import Page from './Page.vue'
import { text } from '@storybook/addon-knobs'

export default {
  component: Page,
  title: 'Shared|Page'
}

const _Page = () => ({
  components: { Page },
  template: `
    <Page :title="title" :subtitle="subtitle">
      <div>Content goes here</div>
    </Page>`,
  props: {
    title: {
      default: text('title', 'Title')
    },
    subtitle: {
      default: text('subtitle', 'Subtitle')
    }
  }
})

export { _Page }