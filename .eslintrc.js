module.exports = {
  extends: ["eslint:recommended", "standard"],
  plugins: ["standard", "mocha"],
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "space-before-function-paren": "off",
    "import/no-extraneous-dependencies": [2, { devDependencies: ["**/*.js"] }]
  },
  globals: {
    document: true,
    fetch: true,
    jest: true,
    it: true,
    beforeEach: true,
    afterEach: true,
    describe: true,
    expect: true
  }
};
