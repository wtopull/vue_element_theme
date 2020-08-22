const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV !== 'development'
const devNeedCdn = true
const cdn = {
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter'
  },
  css: ["https://unpkg.com/element-ui/lib/theme-chalk/index.css"],
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.11',
    'https://unpkg.com/vuex@3.4.0',
    'https://unpkg.com/vue-router@3.2.0/dist/vue-router.js',
    'https://unpkg.com/element-ui/lib/index.js'
  ]
}

module.exports = {
  outputDir: 'ht_dist',
  lintOnSave: false,
  devServer: {
    // 设置主机地址
    host: '',
    port: 6699,
    // 设置代理
    // proxy: {
    //   '/api': {
    //     // 目标 API 地址
    //     // target: 'https://www.laoge.mobi',
    //     target: 'http://localhost:6699',
    //     // 如果要代理 websockets
    //     ws: false,
    //     // 将主机标头的原点更改为目标URL
    //     changeOrigin: false,
    //   },
    // },
  },
  productionSourceMap: false,
  // chainWebpack: config => {
  //   config.entry('main').add('babel-polyfill')
  //   config.module
  //     .rule('images')
  //     .use('image-webpack-loader')
  //     .loader('image-webpack-loader')
  //     .options({ bypassOnDebug: true })
  //     .end()
  //   config.plugin('html').tap(args => {
  //     if (isProduction || devNeedCdn) args[0].cdn = cdn
  //     return args
  //   })
  // },
  configureWebpack: config => {
    // if (isProduction || devNeedCdn) config.externals = cdn.externals
    if (isProduction) {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      const productionGzipExtensions = ['js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      )
      config.optimization = {
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 200000,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '-',
          name: true,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]_?vant(.*)/,
              priority: -10,
              filename: 'vendors.js',
            },
            default: {
              priority: -20,
              reuseExistingChunk: true,
              filename: 'common.js'
            }
          }
        }
      }
    }
  }
};