'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const WebpackCopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: [
      './src/main.js'
    ],
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: 'url-loader',
          },
        }
      ]
    },
    optimization: {
      minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      new WebpackCopyPlugin({
        patterns: [
          { from: 'public', to: 'public' }
        ]
      }),
      new CleanWebpackPlugin(),
    ],
    output: {
      filename: '[name].[chunkhash].js'
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
}