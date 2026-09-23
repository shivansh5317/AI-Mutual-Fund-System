import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      "@typescript-eslint/no-implicit-any": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
