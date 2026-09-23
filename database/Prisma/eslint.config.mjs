import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['schemas/client/**/*', 'schemas/client/**'],
  },
  {
    rules: {
      'vars-on-top': 'off',
      'no-undef': 'off',
    },
  },
];
