import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default {
  ignores: ["node_modules/**", "dist/**", "build/**"],

  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 2021,
    globals: { ...globals.node },
    sourceType: 'module',
  },
  plugins: {
    'stylistic': stylistic,
  },
  rules: {
    ...js.configs.recommended.rules,

    'stylistic/indent': ['error', 2],
    'stylistic/linebreak-style': ['error', 'unix'],
    'stylistic/quotes': ['error', 'single'],
    'stylistic/semi': ['error', 'never'],

    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-console': 0,
  },
}
