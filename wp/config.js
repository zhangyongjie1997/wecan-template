const path = require('path')

module.exports = {
  dev: {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      clientLogLevel: 'warning',
      contentBase: path.join(__dirname, "dist"),
      port: 8080, // 本地服务器端口号
      hot: true, // 热重载
      compress: true,
      overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
      historyApiFallback: {
        // HTML5 history模式
        rewrites: [{ from: /.*/, to: "/index.html" }]
      },
      quiet: true, // necessary for FriendlyErrorsPlugin
      watchOptions: {
        poll: false,
      }
    },
  },
   build: {
    
   }
}