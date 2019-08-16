const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const packageConfig = require('../package.json');

const dir = fs.readdirSync(path.resolve(__dirname, '..','src'));

exports.getHtmlWebpackPluginConfig = (config) => {
  dir.forEach(item => {
    config.plugins.push(new HtmlWebpackPlugin({
      inlineSource: ".(less|css)$",
      filename: `${item}/${item}.html`,
      template: `../src/${item}/${item}.html`,
      chunks: [item],
      inject: true
    }))
  });
}

exports.getEntry = (config) => {
  dir.forEach(item => {
    config.entry[item] = `../src/${item}/${item}.js`;
  });
}


exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.styleLoader = (options) => {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

