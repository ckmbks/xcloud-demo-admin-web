const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const devServerPort = 11001
const serverPort = 10000
const name = ''
let serviceIp = process.env.UIINEE_ADMIN_SERVICE_IP

if (undefined === serviceIp) {
  serviceIp = '127.0.0.1' // 本地

  // serviceIp = '10.30.6.93' // 开发环境
  // serviceIp = 'test.uiinee.com.cn' // 测试环境
  // serviceIp = "dev.uiinee.com.cn"; //开发环境
  // serviceIp = "test2.uiinee.com.cn";
}

module.exports = {
  publicPath: process.env.VUE_APP_BASE_API,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: ['vuetify'],
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    progress: false,
    proxy: {
      '/xclouddemoadminapi': {
        // target: `https://test.wanmds.com/`,
        // target: `http://10.30.6.93:${serverPort}`,
        target: `http://${serviceIp}:${serverPort}`,
        changeOrigin: true,
        ws: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/variables.scss')]
    }
  },
  configureWebpack: (config) => {
    // 去掉ts type check
    if (isDev) {
      config.plugins = config.plugins.filter(
        (p) => !(p instanceof ForkTsCheckerWebpackPlugin)
      )
      config.plugins.push(new HardSourceWebpackPlugin())
    }
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)

    // https://webpack.js.org/configuration/devtool/#development
    // Change development env source map if you want.
    // The default in vue-cli is 'eval-cheap-module-source-map'.
    // config
    //   .when(process.env.NODE_ENV === 'development',
    //     config => config.devtool('eval-cheap-source-map')
    //   )

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: path.resolve(__dirname, 'src/components'),
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
