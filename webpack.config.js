const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const path = require('path')

module.exports = {
  entry: './simple-store/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simpleStore.js',
    library: {
      type: 'umd',
      name: 'SimpleStore'
    }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'example/index.html')
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'app.js',
          context: path.resolve(__dirname, 'example')
        }
      ]
    })
  ]
}