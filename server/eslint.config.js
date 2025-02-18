import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Include browser globals
        ...globals.node,    // Include Node.js globals, including `process`
      },
    },
  },
  pluginJs.configs.recommended,
];
