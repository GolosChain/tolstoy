module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          'golos-ui': './src/components/golos-ui',
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-export-default-from',
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
        displayName: false,
      },
    ],
  ],
  env: {
    development: {
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            ssr: true,
            displayName: true,
          },
        ],
      ],
    },
  },
};
