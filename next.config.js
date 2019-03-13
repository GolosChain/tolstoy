/* eslint-disable no-param-reassign */
const path = require('path');
const DotEnv = require('dotenv-webpack');
const withSass = require('@zeit/next-sass');
//const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

module.exports = withSass({
  webpack: (config, { defaultLoaders }) => {
    config.plugins.push(
      // Read the .env file
      new DotEnv({
        path: path.join(__dirname, '.env'),
        systemvars: !process.env.IN_DOCKER,
      })
    );

    // because of slate editor(rich-html-editor) conflict
    // config.resolve.alias = {
    //     'styled-components': path.resolve('./../../node_modules/styled-components'),
    // };

    return config;
  },
  // analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // bundleAnalyzerConfig: {
  //     server: {
  //         analyzerMode: 'static',
  //         reportFilename: '../../.analyze/server.html',
  //     },
  //     browser: {
  //         analyzerMode: 'static',
  //         reportFilename: '../../.analyze/client.html',
  //     },
  // },
});
