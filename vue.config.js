// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SitemapPlugin = require('sitemap-webpack-plugin').default
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const paths = [
  '/',
  '/examples',
  '/features',
  '/features/map-your-locational-data',
  '/features/filterable',
  '/features/unlimited-geocoding',
  '/features/geojson-and-shapefile-layers',
  '/features/supports-50-000-markers',
  '/features/heat-map-layer',
  '/features/automation',
  '/features/helpful-table-footers'
]

module.exports = {
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin(),
      new VuetifyLoaderPlugin(),
      new SitemapPlugin(process.env.VUE_APP_BASE_URL, paths)
    ]
  }
}