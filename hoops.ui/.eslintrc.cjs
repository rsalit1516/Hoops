/**
 * ESLint configuration for Angular app
 * - Phased rollout: warn on console.* except allow warn/error
 * - Tests (*.spec.ts) are exempt
 */
module.exports = {
  root: true,
  ignorePatterns: ["dist/", "node_modules/"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        // Phase 1: warn on console.* (except warn/error) and guide devs to LoggerService
        "no-console": ["warn", { allow: ["warn", "error"] }],
      },
    },
    {
      files: ["**/*.spec.ts"],
      rules: {
        // Allow console usage in tests
        "no-console": "off",
      },
    },
  ],
};
