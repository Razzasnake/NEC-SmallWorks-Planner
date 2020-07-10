// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SitemapPlugin = require('sitemap-webpack-plugin').default
const PreloadWebpackPlugin = require('preload-webpack-plugin')

const paths = [
  '/',
  '/examples',
  '/features'
]

module.exports = {
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin(),
      new SitemapPlugin(process.env.VUE_APP_BASE_URL, paths),
      new PreloadWebpackPlugin({
        rel: 'preload',
        include: ['Home']
      })
    ]
  }
}