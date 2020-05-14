// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
  }
}