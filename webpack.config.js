var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [ './src/client/index.js' ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      excluse: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
    modulesDirectories: [
        './node_modules'
    ]
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './app'
  }
}