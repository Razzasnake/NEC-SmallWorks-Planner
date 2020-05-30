// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SitemapPlugin = require('sitemap-webpack-plugin').default

const paths = [
  '/examples',
  '/features'
]

module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin(),
      new SitemapPlugin(process.env.VUE_APP_BASE_URL, paths)
    ]
  }
}