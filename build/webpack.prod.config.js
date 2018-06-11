const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function (err, fd) {
  const buf = 'export default "production";';
  fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) { });
});

module.exports = merge(webpackBaseConfig, {
  output: {
    // publicPath: 'dist/',
    filename: 'scripts/[name].[hash].js',
    chunkFilename: 'scripts/[name].[hash].chunk.js'
  },
  plugins: [
    new cleanWebpackPlugin(['dist/*'], {root: path.resolve(__dirname, '../')}),
    new ExtractTextPlugin({filename: 'css/[name].css'}),
    new webpack.optimize.CommonsChunkPlugin({
      // name: 'vendors',
      // filename: 'vendors.[hash].js'
      name: ['vender-exten', 'vender-base'],
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new CopyWebpackPlugin([
      {
        from: 'td_icon.ico'
      },
       {
        from: 'node_modules/iview/dist/styles/fonts',
        to: 'css/fonts'
      },
      {
        from: 'src/views/Main/components/theme-switch/theme',
        to:'css/themes'
      }
    ]),
    new HtmlWebpackPlugin({
      title: `${package.title} v${package.version}`,
      favicon: './td_icon.ico',
      filename: 'index.html',
      template: '!!ejs-loader!./src/template/index.ejs',
      inject: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?name=fonts/[name].[ext]&limit=10240'
      },
      {
        test: /\.(gif|jpg|png)\??.*$/,
        loader: 'url-loader?name=imgs/[name].[ext]&limit=10240'
      },
    ]
  }
});
