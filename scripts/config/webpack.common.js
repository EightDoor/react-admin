const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

const { PROJECT_PATH, isDev } = require('../constant')

const lessRegex = /\.(less)$/
const lessModuleRegex = /\.module\.(less)$/

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isDev && require.resolve('style-loader'),
    !isDev && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
  ].filter(Boolean)
  return loaders
}

const getCssLoaders = (importLoaders) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDev,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          // 修复一些和 flex 布局相关的 bug
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              grid: true,
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          require('postcss-normalize'),
        ],
      },
      sourceMap: isDev,
    },
  },
]

module.exports = {
  target: 'web',
  entry: {
    app: path.resolve(PROJECT_PATH, './src/main.tsx'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '.[fullhash:8]'}.js`,
    path: path.resolve(PROJECT_PATH, './dist'),
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      !isDev &&
        new CssMinimizerPlugin({
          cache: true,
        }),
      !isDev &&
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: { pure_funcs: ['console.log'] },
          },
        }),
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
    ].filter(Boolean),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(PROJECT_PATH, './src'),
      Components: path.resolve(PROJECT_PATH, './src/components'),
      Utils: path.resolve(PROJECT_PATH, './src/utils'),
    },
  },
  plugins: [
    new ESBuildPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './index.html'),
      filename: 'index.html',
      cache: false,
      minify: isDev
        ? false
        : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true,
          },
    }),
    new WebpackBar({
      name: isDev ? '正在启动' : '正在打包',
      color: '#fa8c16',
    }),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(PROJECT_PATH, './public'),
          from: '*',
          to: path.resolve(PROJECT_PATH, './dist'),
          toType: 'dir',
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
  ],
  module: {
    rules: [
      // {
      //   test: /\.(tsx?|js)$/,
      //   loader: 'esbuild-loader',
      //   options: {
      //     loader: 'tsx',
      //     target: 'es2015',
      //     // tsconfigRaw: require('../../tsconfig.json')

      //   },
      //   include: path.resolve('src'),
      // },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true, plugins: [isDev && require.resolve('react-refresh/babel')] },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1),
      },
      {
        test: lessModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: isDev,
            modules: {
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
          'less-loader',
        ),
      },
      {
        test: /\.less$/,
        exclude: lessModuleRegex,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: isDev,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/images',
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/fonts',
            },
          },
        ],
      },
    ],
  },
}
