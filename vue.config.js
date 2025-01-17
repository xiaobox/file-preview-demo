const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [],
  publicPath: '/',
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8081,
    https: false,
    historyApiFallback: true,
    allowedHosts: 'all'
  }
})
