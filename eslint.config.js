const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const reactHooks = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');

module.exports = [
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
      '.eslintcache',
    ],
  },

  js.configs.recommended,

  {
    files: [
      '*.config.js',
      'jest.config.js',
      'jest.config.*.js',
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

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '*.config.js',
      'jest.config.js',
      'jest.config.*.js',
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
        require: 'readonly',
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        exports: 'readonly',
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
      'prettier/prettier': 'error',

      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-static-method',
            'protected-static-method',
            'private-static-method',

            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',

            'constructor',

            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'off',
      'react-native/no-raw-text': 'off',

      'import/order': [
        'error',
        {
          groups: ['external', ['internal'], ['parent', 'sibling'], ['index']],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '{react,react-*,@react-*}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '{react-native,react-native-*,@react-native-*}',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '{expo-*,@expo/*}',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '{rn-navio,mobx-*,lodash}',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '../../store/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '../../services/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '../../{utils,constants,theme}/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '../../{styles,navigation}/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: './*',
              group: 'sibling',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off',

      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      '*.config.js',
      'jest.config.js',
      'jest.config.*.js',
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.js',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },

  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      '*.config.js',
      'jest.config.js',
      'jest.config.*.js',
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.js',
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  {
    files: [
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/*.{test,spec}.{js,jsx,ts,tsx}',
      'tests/**/*.{js,jsx,ts,tsx}',
      'jest.setup.js',
      'jest.cleanup.js',
    ],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',
        __DEV__: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  {
    files: ['tests/visual/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',

        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        Event: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['config/jest/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',
        __DEV__: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-console': 'off',
    },
  },
];
