// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash:8].js',
    },
    plugins: [
      // new BundleAnalyzerPlugin()
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `npm.${packageName.replace('@', '')}`
            },
          },
        },
      }
    }
  }
}