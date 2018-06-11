const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./build/env.js', 'w', function (err, fd) {
  const buf = 'export default "development";';
  fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) { });
});

module.exports = merge(webpackBaseConfig, {
  devtool: '#source-map',
  output: {
    // publicPath: 'dist/',
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[name].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'css/[name].css', allChunks: false }),
    new webpack.optimize.CommonsChunkPlugin({ name: ['vender-exten', 'vender-base'], minChunks: Infinity })
  ],
  module: {
    rules: [
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(gif|jpg|png)\??.*$/,
        loader: 'url-loader?name=imgs/[name].[ext]'
      },
    ]
  }
});