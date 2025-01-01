import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off', // Disable the "ban-ts-comment" rule
            '@typescript-eslint/no-explicit-any': 'off', // Disable the "no-explicit-any" rule
            '@typescript-eslint/no-unused-vars': 'off', // Disable the "no-explicit-any" rule
        },
    },
];

export default eslintConfig;
