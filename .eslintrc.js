module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    'import'
  ],
  'extends': [
    'plugin:vue/recommended',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/multi-word-component-names': 'off',
    'no-console': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
