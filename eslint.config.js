import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import eslintPluginSolid from 'eslint-plugin-solid'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import eslintPluginYaml from 'eslint-plugin-yaml'
import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import eslintPluginJest from 'eslint-plugin-jest'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
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
  },
  {
    files: ['**/*.{js,jsx}'],
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
    files: ['apps/backend/**/*.ts'],
    extends: [...compat.extends('nestjs')],
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
