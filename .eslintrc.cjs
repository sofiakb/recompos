module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'dev-dist', 'coverage', '*.cjs', '*.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
  },
  // One `overrides` key only: a second literal silently replaces the first.
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', 'src/test/**'],
      env: { node: true },
    },
    {
      // Local tooling runs on Node, not in a browser.
      files: ['tools/*.mjs'],
      env: { browser: false, node: true, es2022: true },
    },
    {
      // The one file where an invisible space is content, not a typo: French
      // typography puts an unbreakable space before « ? », « : » and « % » so a
      // phone never leaves the punctuation stranded on its own line. `fr.test.ts`
      // checks that spacing on purpose, which is the guard this rule gives up.
      files: ['src/i18n/*.ts'],
      rules: { 'no-irregular-whitespace': 'off' },
    },
  ],
}
