/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {jsx: true}
  },
  settings: {
    react: {version: 'detect'},
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended' // must be last
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'no-only-tests'],
  rules: {
    // --- Complexity & quality ---
    complexity: ['error', 15],
    eqeqeq: ['error', 'always'],
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',

    // --- Imports ---
    'import/no-default-export': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {pattern: '@/**', group: 'internal', position: 'before'}
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {order: 'asc', caseInsensitive: true}
      }
    ],
    'import/no-cycle': 'warn',

    // --- Tests ---
    'no-only-tests/no-only-tests': 'error',

    // --- TypeScript ---
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],

    // --- React ---
    'react/react-in-jsx-scope': 'off', // new JSX transform
    'react/display-name': 'off',
    'react/prop-types': 'off', // using TypeScript

    // --- Prettier ---
    'prettier/prettier': 'warn'
  },
  overrides: [
    {
      // expo-router requires default exports in app/ directory
      files: ['app/**/*.tsx', 'app/**/*.ts', 'app.config.ts'],
      rules: {
        'import/no-default-export': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.expo/',
    'android/',
    'ios/',
    'web-build/',
    '*.config.js'
  ]
}

