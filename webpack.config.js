const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "./"),
  entry: {
    index: "./src/index/index.js",
    shr: "./src/shr/shr.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/js/index.js",
    publicPath: 'dist/'
  },
  devtool: "source-map", // 开启调试
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 8080, // 本地服务器端口号
    hot: true, // 热重载
    overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ from: /.*/, to: "/index.html" }]
    }
  },
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
    new HtmlWebpackPlugin({
      inlineSource: ".(less|css)$",
      filename: "index/index.html",
      template: "./src/index/index.html",
      chunks: ["index"],
      inject: true
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true
      // }
    }),
    new HtmlWebpackPlugin({
      inlineSource: ".(less|css)$",
      filename: "shr/shr.html",
      template: "./src/shr/shr.html",
      chunks: ["shr"],
      inject: true
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true
      // }
    }),
    new MiniCssExtractPlugin({
      filename: "[name]/css/[name].css",
      chunkFilename: "css/[name].css"
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
      cssProcessor: require("cssnano"), //用于优化\最小化CSS的CSS处理器，默认为cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给cssProcessor的选项，默认为{}
      canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: true,
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
