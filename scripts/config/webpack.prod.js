const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')
const path = require('path')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { PROJECT_PATH } = require('../constant')

const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    // 打包之前清除dist文件
    new CleanWebpackPlugin(),
    // 去除无用css样式
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(PROJECT_PATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
      whitelist: ['html', 'body'],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server', // 开一个本地服务查看报告
      analyzerHost: '127.0.0.1', // host 设置
      analyzerPort: 8888, // 端口号设置
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false,
    }),
  ],
})
