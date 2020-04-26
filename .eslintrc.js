module.exports = {
  "extends": [
    "airbnb/base",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  "rules": {
    "indent": ["error", 2],
    "prefer-const": ["error"],
    "no-const-assign": ["error"],
    "semi": 2,
    "comma-dangle": ["error"],
    "quotes": ["error", "double"],
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "max-len": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "no-param-reassign": 0,
    "operator-linebreak": ["error", "after", { "overrides": { "??": "ignore", ":": "ignore" } }],
    "consistent-return": 0,
    "indent": "off",
    "operator-linebreak": "off",
    "eqeqeq": ["error", "always", {"null": "ignore"}]
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["@", "./src/"],
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      }
    }
  },
  overrides: [
    {
      files: [
        "**/*.test.js"
      ],
      env: {
        jest: true
      }
    }
  ]
}
