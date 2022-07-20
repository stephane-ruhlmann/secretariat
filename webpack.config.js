const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const _ = require('lodash')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const pageDir = path.join(__dirname, 'src', 'views', 'pages')

const pageEntries = fs
  .readdirSync(pageDir)
  .filter((name) => name.endsWith('Page.tsx') || name.endsWith('Page'))
  .map((name) => {
    if (name.endsWith('.tsx')) {
      return { name: path.basename(name, 'Page.tsx'), path: path.join(pageDir, name) }
    } else {
      return {
        name: path.basename(name, 'Page'),
        path: path.join(
          pageDir,
          name,
          _.startCase(path.basename(name, 'Page')).replace(/ /g, '') + '.tsx'
        ),
      }
    }
  })
  .reduce(
    (entries, { name, path }) => ({
      ...entries,
      [name]: {
        import: path,
        dependOn: 'shared',
      },
    }),
    {}
  )

module.exports = {
  mode:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
      ? 'production'
      : 'development',
  entry: {
    ...pageEntries,
    shared: ['react', 'react-dom', 'moment', 'moment-timezone'],
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      // new MiniCssExtractPlugin(),
      new TsconfigPathsPlugin()],
    fallback: { path: require.resolve('path-browserify') },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
    }),
  ],
  module: {
    loaders: [
      {
          test: /\.css$/,
          loader: 'style-loader'
      }, {
          test: /\.css$/,
          loader: 'css-loader',
          query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
          }
      }
  ],
    rules: [
      // {
      //   test: /\.css$/i,
      //   use: [
      //     MiniCssExtractPlugin.loader, // instead of style-loader
      //     'css-loader'
      //   ]
      // },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        exclude: '/node_modules/',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src', 'public', 'js'),
  },
}