// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// eslint.config.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'next/core-web-vitals',
    'prettier',
), {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parser: '@typescript-eslint/parser',
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: __dirname,
            sourceType: 'module',
        },
    },
    plugins: {
        'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
        'unused-imports/no-unused-imports': 'error',
    },
}, ...storybook.configs["flat/recommended"]];
