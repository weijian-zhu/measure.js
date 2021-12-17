const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { version } = require('./package.json')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: {
      name: 'measure',
      type: 'window'
    }
  },
  // devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ['console.info', 'console.debug', 'console.log']
          }
        },
        extractComments: false
      })
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `/*!\n * measure.js v${version}\n * Copyright (c) 2021 weijian zhu\n * Released under the MIT License.\n*/`,
      raw: true
    })
  ]
}
