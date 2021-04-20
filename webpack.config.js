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
  }
}