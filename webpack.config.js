var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    './src/client/index.js'
  ],
  progress: true,
  colors: true,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.html']
  },
  resolveLoader: {
    modulesDirectories: [
        './node_modules'
    ]
  },
  output: {
    path: __dirname + '/app',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}