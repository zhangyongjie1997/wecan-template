const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const getHtmlWebpackPluginConfig = require('./utils').getHtmlWebpackPluginConfig;
const getEntry = require('./utils').getEntry;


const config = {
  context: path.resolve(__dirname, "./"),
  entry: {},
  output: {
    path: path.resolve(__dirname, '..', "dist"),
    filename: "[name]/js/index.js",
    publicPath: 'dist/'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(less|css)(\?.*)?$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 }
          },
          {
            loader: "postcss-loader",
            options: { plugins: [require("autoprefixer")] }
          },
          "less-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "img/[name].[ext]",
          publicPath: 'dist/'
        }
      },
      {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]/css/[name].css",
      chunkFilename: "css/[name].css"
    }),
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
    //   cssProcessor: require("cssnano"), //用于优化\最小化CSS的CSS处理器，默认为cssnano
    //   cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给cssProcessor的选项，默认为{}
    //   canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
    // }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: false,
    // splitChunks: {
    //   chunks: "async",
    //   minSize: 30000,
    //   minChunks: 1,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   name: false,
    //   cacheGroups: {
    //     commons: {
    //       name: "commons",
    //       chunks: "initial",
    //       minChunks: 2
    //     }
    //   }
    // }
  }
};

getHtmlWebpackPluginConfig(config);
getEntry(config);

module.exports = config;

