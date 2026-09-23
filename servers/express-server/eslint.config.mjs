import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      'import/no-unresolved': 'off',
      'no-unused-vars': 'off',
      'no-console': 'off',
      'arrow-body-style': 'off',
      'lines-between-class-members': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'consistent-return': 'off',
      'no-param-reassign': 'off',
    },
  }
];
