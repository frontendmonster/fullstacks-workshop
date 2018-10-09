const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { generateWebpackRules } = require('@frontendmonster/dev-utils/webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');

const root = path.join(__dirname, '..', '..');

const config = {
  target: 'web',
  entry: ['./src'],
  output: {
    path: path.join(root, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    sourceMapFilename: '[name].[hash].map',
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.mjs', '.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      ...generateWebpackRules(
        {
          babel: true,
          graphql: true,
          font: true,
          image: true,
          mjs: true,
        },
      ),
      {
        test: /\.scss$/, // Change .css to .scss
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true, // Add this option
              localIdentName: '[name]__[local]__[hash:base64:5]', // Add this option
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              includePaths: [path.join(root, 'src', 'styles')],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) } }),
    new CaseSensitivePathsPlugin(),
  ],
};

if (process.env.WBA) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
