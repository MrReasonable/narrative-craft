import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import eslintPluginSolid from 'eslint-plugin-solid'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import eslintPluginYaml from 'eslint-plugin-yaml'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import eslintPluginJest from 'eslint-plugin-jest'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import sonarjs from 'eslint-plugin-sonarjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['**/*.{js,ts,tsx,mjs,cjs}'],
    extends: [sonarjs.configs.recommended, eslintPluginUnicorn.configs['flat/recommended']],
    rules: {
      'unicorn/prevent-abbreviations': [
        'error',
        {
          ignore: [/.*\.e2e.*/, /env\..*$/],
        },
      ],
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './libs/*/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['**/*.spec.{js,ts,tsx}', '**/*.e2e-spec.{js,ts,tsx}'],
    extends: [eslintPluginJest.configs['flat/recommended']],
    rules: {
      'jest/expect-expect': [
        'warn',
        {
          assertFunctionNames: ['expect', 'request.**.expect'],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['.husky/**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['apps/web-app/**/*.{ts,tsx}'],
    ...eslintPluginSolid.configs['flat/typescript'],
  },
  {
    files: ['apps/web-app/**/*.tsx'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
  {
    files: ['apps/backend/**/*.ts'],
    extends: [...compat.extends('nestjs')],
    rules: {
      'unicorn/prefer-top-level-await': 'off',
    },
  },
  {
    files: ['**/*.json'],
    plugins: {
      jsonc: eslintPluginJsonc,
    },
    languageOptions: {
      parser: eslintPluginJsonc.jsonc,
    },
    rules: {
      ...eslintPluginJsonc.configs['recommended-with-json'].rules,
    },
  },
  {
    files: ['**/*.{yaml,yml}'],
    extends: [eslintPluginYaml.configs.recommended],
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', 'dist', 'build', 'coverage'],
  },
  eslintPluginPrettierRecommended,
)
