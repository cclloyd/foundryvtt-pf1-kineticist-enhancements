module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },

    env: {
        browser: true,
        es6: true,
        jquery: true,
    },

    extends: ['eslint:recommended', '@typhonjs-fvtt/eslint-config-foundry.js', 'plugin:prettier/recommended'],

    plugins: [],

    rules: {
        'no-unused-vars': 'warn',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        'no-shadow': ['error', { builtinGlobals: true, hoist: 'all', allow: ['event'] }],
    },
    overrides: [
        {
            files: ['./*.js'],
            env: {
                node: true,
            },
        },
    ],
};
