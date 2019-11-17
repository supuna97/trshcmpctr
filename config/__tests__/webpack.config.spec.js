const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const serializer = require('jest-serializer-path');
const webpack = require('webpack');

const webpackConfig = require('../../webpack.config');

// Remove absolute paths from snapshots.
expect.addSnapshotSerializer(serializer);

describe('webpack', () => {
  const developmentEnvironment = {};
  const productionEnvironment = { production: true };
  let developmentConfig;
  let productionConfig;

  describe('common config', () => {

    beforeAll(() => {
      developmentConfig = webpackConfig(developmentEnvironment);
      productionConfig = webpackConfig(productionEnvironment);
      Object.freeze(developmentConfig);
      Object.freeze(productionConfig);
    });

    it('sets entry points', () => {
      expect(developmentConfig.entry).toHaveProperty('index', './src/index.ts');
      expect(productionConfig.entry).toStrictEqual(developmentConfig.entry);
    });

    it('sets output', () => {
      expect(developmentConfig.output).toHaveProperty('filename', '[name].[chunkhash].js');
      expect(developmentConfig.output).toHaveProperty('path', expect.any(String));
      expect(productionConfig.output).toStrictEqual(developmentConfig.output);
    });

    it('sets module rules', () => {
      expect(developmentConfig.module).toHaveProperty('rules', expect.any(Array));
      expect(productionConfig.module).toStrictEqual(developmentConfig.module);
    });

    it('sets optimizations', () => {
      expect(developmentConfig.optimization).toHaveProperty('splitChunks', expect.any(Object));
      expect(productionConfig.optimization).toStrictEqual(developmentConfig.optimization);
    });

    it('sets plugins', () => {
      expect(developmentConfig.plugins).toMatchObject([
        expect.any(CleanWebpackPlugin),
        expect.any(webpack.ProgressPlugin),
        expect.any(HtmlWebpackPlugin),
      ]);
      // Can't use deep-equality checks around plugins since they're unique class instances so repeat same assertion against productionConfig.
      // Otherwise, toEqual/toStrictEqual comparisons fail with "Received: serializes to the same string".
      expect(productionConfig.plugins).toMatchObject([
        expect.any(CleanWebpackPlugin),
        expect.any(webpack.ProgressPlugin),
        expect.any(HtmlWebpackPlugin),
      ]);
    });

    it('sets dev server options', () => {
      expect(developmentConfig.devServer).toHaveProperty('open', true);
      expect(productionConfig.devServer).toStrictEqual(developmentConfig.devServer);
    });

  });

  describe('development config', () => {

    beforeAll(() => {
      developmentConfig = webpackConfig(developmentEnvironment);
      Object.freeze(developmentConfig);
    });

    it('matches snapshot', () => {
      expect(developmentConfig).toMatchSnapshot();
    });

    it('sets development mode', () => {
      expect(developmentConfig.mode).toEqual('development');
    });

  });

  describe('production config', () => {

    beforeAll(() => {
      productionConfig = webpackConfig(productionEnvironment);
      Object.freeze(productionConfig);
    });

    it('matches snapshot', () => {
      expect(productionConfig).toMatchSnapshot();
    });

    it('sets production mode', () => {
      expect(productionConfig.mode).toEqual('production');
    });

  });

});
