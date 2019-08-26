module.exports = {
  parser: "babel-eslint", // define babel as the parser
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  plugins: ["react"],
  parserOptions: {
    ecmaVersion: 2018, // understands let, const and other features
    sourceType: "module", // understands the use of import and export
    ecmaFeatures: {
      jsx: true // understands the use of tags inside js files
    }
  },
  rules: {
    "react/prop-types": ["error", { skipUndeclared: true }]
  },
  env: {
    browser: true, // add browser globals variables like document and window
    es6: true, // add globals like Set
    jest: true
  }
};
