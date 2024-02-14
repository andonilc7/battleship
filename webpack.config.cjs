const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'eval-source-map',
  mode: 'development',
  resolve: {
    fallback: {
      util: require.resolve("util/"),
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
    
  },

};