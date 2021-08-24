module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },

    env: {
        browser: true,
        es6: true,
    },

    extends: ['eslint:recommended', '@typhonjs-fvtt/eslint-config-foundry.js/0.8.0', 'plugin:prettier/recommended'],

    plugins: [],

    rules: {
        'no-unused-vars': 'warn',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
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
