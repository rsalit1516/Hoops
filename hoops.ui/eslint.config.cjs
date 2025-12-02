// ESLint Flat Config for Angular project (CommonJS)
// Phase 1: Only warn on console.* (allow warn/error). Keep everything else minimal.

const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  // Global ignores to keep lint fast and avoid build artifacts
  {
    ignores: [
      "dist/**",
      "**/dist/**",
      "node_modules/**",
      "**/*.js",
      "**/*.cjs",
      "**/*.mjs",
    ],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Phase 1 policy: nudge developers away from console.log/info/debug
      // but don't fail CI. warn/error still allowed for urgent messages.
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Defer stricter TS rules until Phase 2
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
    },
  },
  {
    files: ["**/*.spec.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["src/app/services/logger.service.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
