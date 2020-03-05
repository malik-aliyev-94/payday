const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  node: {
    __dirname: false
  },
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    // new CleanWebpackPlugin(), 
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin([
      { from: path.join(__dirname, 'src/media'), to: path.join(__dirname, 'dist/media') },
      { from: path.join(__dirname, 'src/cloud'), to: path.join(__dirname, 'dist/cloud') },
    ]),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
};