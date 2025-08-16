const js = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
    {
        ignores: ['dist/**', 'env/**', 'node_modules/**'],
    },

    // 2) JS: apply ESLint recommended rules (scoped to JS files)
    {
        ...js.configs.recommended,
        files: ['**/*.{js,mjs,cjs}'],
    },

    // 3) JS: project-specific env/options/rules
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2020,
                $: 'readonly',
                jQuery: 'readonly',
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-shadow': ['error', { builtinGlobals: true, hoist: 'all', allow: ['event'] }],
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },

    // 4) Node globals for top-level config scripts (like your previous overrides)
    {
        files: ['./*.{js,mjs,cjs}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // 5) TypeScript: add minimal support to lint .ts/.d.ts files
    {
        files: ['**/*.{ts,tsx,d.ts}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                // If you want type-aware linting, uncomment and point to your tsconfig:
                // project: ['./tsconfig.json'],
            },
            globals: {
                ...globals.browser,
                ...globals.es2020,
                $: 'readonly',
                jQuery: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            // Disable base rules that conflict with TS-aware ones
            'no-unused-vars': 'off',
            'no-shadow': 'off',
            'no-undef': 'off',

            // TS equivalents / additions
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-shadow': ['error', { builtinGlobals: true, hoist: 'all', allow: ['event'] }],

            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },
];
