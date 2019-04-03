module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018
  },
  plugins: ['react'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': [
      1,
      {
        argsIgnorePattern: 'Promise|res|next|^err'
      }
    ],
    camelcase: 0,
    'func-names': 0,
    'arrow-body-style': 0,
    'no-param-reassign': 0,
    'prefer-promise-reject-errors': 0
  }
};
