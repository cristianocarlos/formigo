import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import eslintReact from '@eslint-react/eslint-plugin';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import perfectionistPlugin from 'eslint-plugin-perfectionist';

export default tseslint.config(
  {
    extends: [
      eslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
      prettierConfig,
      ...tseslint.configs.recommended,
    ],
    plugins: {
      perfectionist: perfectionistPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Desativados para facilitar a conversão, podem ser reativados avaliando caso a caso
      //
      '@eslint-react/dom-no-dangerously-set-innerhtml': ['off'],
      '@eslint-react/naming-convention-ref-name': ['off'],
      '@eslint-react/set-state-in-effect': ['off'],
      '@typescript-eslint/consistent-type-assertions': ['error', {assertionStyle: 'as'}],
      '@typescript-eslint/consistent-type-imports': ['error'],
      '@typescript-eslint/no-inferrable-types': ['error'],
      '@typescript-eslint/no-unused-expressions': ['error', {allowShortCircuit: true}], // Permite &&
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: 'React',
        },
      ],
      'no-useless-escape': ['off'],
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          type: 'alphabetical', // Options: 'alphabetical', 'natural', 'line-length'
          order: 'asc', // Options: 'asc', 'desc'
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
          sortBy: 'path',
          internalPattern: ['^@/.+'],
          newlinesBetween: 1,
          groups: [
            'style',
            ['value-builtin', 'value-external'],
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'ts-equals-import',
            ['type-parent', 'type-sibling', 'type-index', 'type-internal', 'type-import'],
            'unknown',
          ],
          environment: 'node',
          useExperimentalDependencyDetection: true,
        },
      ],
      'perfectionist/sort-named-exports': ['warn'],
      'perfectionist/sort-named-imports': ['warn'],
      'perfectionist/sort-object-types': ['warn'],
      'perfectionist/sort-objects': ['warn'],
      'perfectionist/sort-switch-case': ['warn'],
      'perfectionist/sort-union-types': ['warn'],
    },
  },
  {
    files: ['**/*.test.*sx', '**/*.spec.*sx'], // Para overrides nas especificações dos testes
    rules: {},
  },
);
