const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: '.', globOptions: { ignore: ['**/index.html'] } }],
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    proxy: [
      {
        context(pathname) {
          return (
            pathname.startsWith('/api/transcribe') ||
            pathname.startsWith('/api/logs') ||
            pathname.startsWith('/api/fleets') ||
            pathname.startsWith('/api/troubleshoot')
          );
        },
        target: 'http://127.0.0.1:8000',
      },
      {
        context: ['/api'],
        target: 'http://localhost:3001',
      },
    ],
  },
};
