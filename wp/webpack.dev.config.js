const baseConfig = require('./webpack.base.config.js');
const merge  = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const utils = require('./utils.js');
const config = require('./config');


const devConfig = merge(baseConfig, config.dev, {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://localhost:${config.dev.devServer.port}`],
      },
      onErrors: utils.createNotifierCallback()
    })
  ]
});
console.log(devConfig.module.rules)
module.exports = devConfig;