var config  = require('./webpack.config');
var webpack = require('webpack');

config.plugins = [new webpack.HotModuleReplacementPlugin()];
config.entry = [
  'webpack-dev-server/client?http://localhost:3001',
  'webpack/hot/only-dev-server',
  './src/client/index.js'
];
module.exports = config;