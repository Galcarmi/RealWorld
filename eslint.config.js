const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const reactHooks = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.expo/**',
      'android/**',
      'ios/**',
      '*.generated.*',
      'coverage/**',
      '__tests__/**',
      '.eslintcache',
    ],
  },

  // Base configuration for all files
  js.configs.recommended,

  // Configuration files (Node.js environment)
  {
    files: [
      '*.config.js',
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.js',
    ],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        global: 'readonly',
        console: 'readonly',
      },
      sourceType: 'script',
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
    },
  },

  // TypeScript and React configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '*.config.js',
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.js',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        alert: 'readonly',
        require: 'readonly', // For React Native require() calls
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-native': reactNative,
      'react-hooks': reactHooks,
      import: importPlugin,
      prettier,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            // Static members first
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-static-method',
            'protected-static-method',
            'private-static-method',

            // Instance fields
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',

            // Constructor
            'constructor',

            // Instance methods (public first, then private)
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],

      // React specific rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native specific rules
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'off', // Allow color literals for theme integration
      'react-native/no-raw-text': 'off', // Allow raw text in Text components

      // Import/Export rules (simplified to avoid resolver issues)
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off', // Disabled for React Native

      // General code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off', // Using TypeScript version
      'prefer-const': 'error',
      'no-var': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // TypeScript-specific overrides
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      '*.config.js',
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.js',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },

  // JavaScript-specific overrides
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      '*.config.js',
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.js',
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
