const globals = require("globals");

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.node
      },
      ecmaVersion: "latest",
      sourceType: "commonjs"
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error"
    },
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "test-*.js",
      "minimal-*.js"
    ]
  },
  {
    files: ["seed.js"],
    rules: {
      "no-console": "off"
    }
  }
];
