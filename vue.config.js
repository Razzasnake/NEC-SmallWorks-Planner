// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SitemapPlugin = require('sitemap-webpack-plugin').default
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const paths = [
  '/',
  '/examples',
  '/features',
  '/feature/map-your-csv-or-excel-locational-data',
  '/feature/filter-with-shapes',
  '/feature/unlimited-geocoding',
  '/feature/geojson-and-shapefile-layers',
  '/feature/supports-50-000-markers',
  '/feature/heat-map-layer',
  '/feature/automation',
  '/feature/helpful-table-footers'
]

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
      new SitemapPlugin(process.env.VUE_APP_BASE_URL, paths)
    ]
  }
}