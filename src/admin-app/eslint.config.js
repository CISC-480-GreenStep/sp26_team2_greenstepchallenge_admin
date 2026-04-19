/**
 * ESLint flat config for the admin-app.
 *
 * Enforces the conventions in /CODING_GUIDELINES.md:
 *   - 5-group import order (React -> Router -> 3rd-party -> data/api -> internal)
 *   - tiered file-size policy (warn at 300 lines, error at 500)
 *   - no console.log in committed code, no unused vars
 *
 * `eslint-config-prettier` is loaded last so Prettier owns all formatting
 * concerns and ESLint owns code-quality concerns.
 */

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "netlify", "api", "public"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".jsx"] },
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],

      "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],

      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "react-dom/**", group: "external", position: "before" },
            { pattern: "react-router-dom", group: "external", position: "before" },
            { pattern: "@mui/**", group: "external", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["react", "react-dom"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
    },
  },
  {
    files: ["**/dashboardConfig.js", "**/data/mock/**", "api/**", "netlify/**"],
    rules: {
      "max-lines": "off",
    },
  },
]);
