module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'standard',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': [
      'error',
      {
        skipUndeclared: true,
      },
    ],
    'react/display-name': 0,
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/require-render-return': 0,
    'react/react-in-jsx-scope': 1,
    'react/prop-types': 0,
    'no-console': 'warn',
    'no-unused-vars': ['error', { vars: 'all', args: 'all' }],
    'react-hooks/rules-of-hooks': 'error',
    camelcase: 0,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
}
