const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Generate build config
 * @param env Build environment
 */
function getBaseConfig(env) {
  return {
    mode: getMode(env),

    entry: getEntries(),

    output: getOutput(),

    plugins: getPlugins(),

    optimization: {
      splitChunks: getSplitChunks(),
    },

    devServer: getDevServer(),
  };
}

/**
 * Get dev server config
 */
function getDevServer() {
  return {
    open: true,
  };
}

/**
 * Get build entry point/s
 */
function getEntries() {
  return {
    index: './src/index.js',
    lib: './src/lib.js',
  };
}

/**
 * Get build mode
 * @param env Environment
 */
function getMode(env) {
  return env.production
    ? 'production'
    : 'development';
}

/**
 * Get module rules
 */
function getModuleRules() {
  return [
    {
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',

      options: {
        emitWarning: true,
      },
    },
    {
      test: /.(js|jsx)$/,
      include: [
        path.resolve(__dirname, '../src'),
      ],
      loader: 'babel-loader',

      options: {
        plugins: [
          'syntax-dynamic-import',
        ],

        presets: [
          ['@babel/preset-env', {
            'modules': false,
          }],
        ],
      },
    }
  ];
}

/**
 * Get build output file/s
 */
function getOutput() {
  return {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist'),
  };
}

/**
 * Get build plugins
 */
function getPlugins() {
  return [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin(),
  ];
}

/**
 * Get splitChunksPlugin
 */
function getSplitChunks() {
  return {
    cacheGroups: {
      vendors: {
        priority: -10,
        test: /[\\/]node_modules[\\/]/
      }
    },

    chunks: 'async',
    minChunks: 1,
    minSize: 30000,
    name: true
  };
}

module.exports = {
  getBaseConfig,
  getDevServer,
  getEntries,
  getMode,
  getModuleRules,
  getOutput,
  getPlugins,
  getSplitChunks,
};
