module.exports = {
    presets: ['next/babel'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['.', './src/app'],
                alias: {
                    'golos-ui': './src/app/components/golos-ui',
                    mocks: './src/app/mocks',
                    components: './src/app/components',
                    shared: './src/app/shared',
                    store: './src/app/store',
                    utils: './src/app/utils',
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
