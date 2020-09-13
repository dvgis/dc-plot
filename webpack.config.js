/**
 * @Author: Caven
 * @Date: 2020-08-30 09:15:33
 */

const path = require('path')
const webpack = require('webpack')
const JavaScriptObfuscator = require('webpack-obfuscator')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = env => {
  const IS_PROD = (env && env.production) || false
  const publicPath = IS_PROD ? '/' : '/'
  let plugins = []
  if (IS_PROD) {
    plugins.push(new webpack.NoEmitOnErrorsPlugin())
    plugins.push(
      new JavaScriptObfuscator(
        {
          rotateStringArray: true
        },
        []
      )
    )
  }
  return {
    entry: {
      'dc.plot': ['entry']
    },
    devtool: IS_PROD ? false : 'source-map',
    output: {
      filename: IS_PROD ? '[name].min.js' : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: publicPath,
      library: 'DcPlot',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            compact: false,
            ignore: ['checkTree']
          }
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 20000
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.css'],
      alias: {
        '@': resolve('src'),
        entry: './src/index.js'
      }
    },
    plugins
  }
}
