const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

// Plugins
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ScreepsWebpackPlugin = require('./build/screepsWebpackPlugin');

// variables
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

module.exports = {
  entry: {
    main: sourcePath + '/overmind.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true
        }
      }
    ]
  },
  output: {
    path: outPath,
    filename: 'main.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new CleanWebpackPlugin([outPath]),
    new ScreepsWebpackPlugin()
  ],
  target: 'node',
  resolve: {
    extensions: [ '.js' ]
  }
};
