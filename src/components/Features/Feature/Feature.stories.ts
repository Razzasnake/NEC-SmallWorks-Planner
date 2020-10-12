import Feature from './Feature.vue'
import { features } from '@/entities/data'
import { action } from '@storybook/addon-actions'

export default {
  component: Feature,
  title: 'Features/Feature'
}

const FeatureTemplate = (args, { argTypes }) => ({
  components: { Feature },
  template: `
    <Feature
      :feature="feature"
      @finish="finish"
    ></Feature>`,
  props: Object.keys(argTypes),
  methods: {
    finish: action('finish')
  }
})

export const MapYourLocationData = FeatureTemplate.bind({})
MapYourLocationData.args = { feature: features[0] }

export const Filterable = FeatureTemplate.bind({})
Filterable.args = { feature: features[1] }

export const UnlimitedGeocoding = FeatureTemplate.bind({})
UnlimitedGeocoding.args = { feature: features[2] }

export const GeojsonAndShapefileLayers = FeatureTemplate.bind({})
GeojsonAndShapefileLayers.args = { feature: features[3] }

export const SupportsManyMarkers = FeatureTemplate.bind({})
SupportsManyMarkers.args = { feature: features[4] }

export const HeatMapLayer = FeatureTemplate.bind({})
HeatMapLayer.args = { feature: features[5] }

export const CategoricalGrouping = FeatureTemplate.bind({})
CategoricalGrouping.args = { feature: features[6] }

export const Automation = FeatureTemplate.bind({})
Automation.args = { feature: features[7] }

export const HelpfulTableFooters = FeatureTemplate.bind({})
HelpfulTableFooters.args = { feature: features[8] }