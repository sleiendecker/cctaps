'use strict';

var path = require('path');

module.exports = {
  entry: './public/js/index.js',
  output: {
    path:      path.join(__dirname, 'build/js/'),
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js']
  },
  colors: true,
  inline: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?optional=runtime'
      },
      {
        test: /\.(woff|otf|eot|woff2|svg|ttf|png|jpg|jpeg)$/,
        loader: 'url?limit=100000'
      }
    ]
  }
};