import InfoSection from './InfoSection.vue'

export default {
  component: InfoSection,
  title: 'Home|InfoSection'
}

const _InfoSection = () => ({
  components: { InfoSection },
  template: `
    <InfoSection
      :title="title"
      :description="description"
      :cards="cards"
    ></InfoSection>`,
  props: {
    title: {
      default: 'Example title'
    },
    description: {
      default: 'Example description'
    },
    cards: {
      default: [
        {
          title: 'Test 1',
          description: 'Test Description 1',
          learnMorePath: ''
        },
        {
          title: 'Test 2',
          description: 'Test Description 2',
          learnMorePath: ''
        },
        {
          title: 'Test 3',
          description: 'Test Description 3',
          learnMorePath: ''
        }
      ]
    }
  }
})

export { _InfoSection }