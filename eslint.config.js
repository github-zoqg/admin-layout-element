import { defineConfig, globalIgnores } from 'eslint/config';
import vue from 'eslint-plugin-vue';
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**', 'public/**', 'vite.config.js']),
  js.configs.recommended,
  // ...vue.configs['flat/recommended'],
  {
    // ignore: ['**/dist/**', '**/node_modules/**', '**/public/**', '**/vite.config.js'],
    //   files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 1,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': ts },
    rules: {
      ...ts.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.vue'],
    // 扩展vue推荐规则
    extends: [...vue.configs['flat/recommended']],
    languageOptions: {
      // parser: tsParser,
      // 格式化参数
      parserOptions: {
        // js版本
        ecmaVersion: 'latest',
        // 文件类型
        sourceType: 'module',
        // 允许解析.vue文件
        extraFileExtensions: ['.vue'],
        // 允许解析jsx语法
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 禁用Vue属性换行检查
      'vue/max-attributes-per-line': 'off',
      // 禁用Vue自闭合标签检查
      'vue/html-self-closing': 'off',
      // 禁用Vue组件命名规则检查
      'vue/multi-word-component-names': 'off',
      // 允许使用v-html指令
      'vue/no-v-html': 'off',
      // 允许在模板中使用未注册的组件
      'vue/no-reserved-component-names': 'off',
      // 允许在模板中使用未注册的组件
      'vue/require-explicit-emits': 'off',
      // 允许在模板中使用未注册的组件
      'vue/require-default-prop': 'off',
      // 单行元素内容换行检查
      'vue/singleline-html-element-content-newline': 'off',
      // 关闭驼峰命名检查
      'vue/camelcase': 'off',
      // 关闭html换行检查
      'vue/html-closing-bracket-newline': 'off',
      // 关闭html缩进检查
      'vue/html-indent': 'off',
      'vue/v-on-event-hyphenation': 0,
    },
  },
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
