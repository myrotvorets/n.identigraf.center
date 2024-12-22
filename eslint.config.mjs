import Config from '@myrotvorets/eslint-config-myrotvorets-preact-ts';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: ['dist/**'],
    },
    ...Config,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
