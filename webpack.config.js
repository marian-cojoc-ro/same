var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve('src', 'same.js'),

  output: {
    path: path.resolve(__dirname, 'assets'),
    publicPath: '/',
    filename: 'same.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ]
  }
};
