/**
 * @file eslint.config.js
 * @description ESLint 的 Flat Config 配置文件。定义了项目使用的 ESLint 规则、插件和语言选项。
 * @modification
 *   - [ESLint配置]：配置 `@typescript-eslint/no-unused-vars` 规则，使其忽略以 `_` 开头的参数和变量。
 *   - **修改原因**: 解决了 `ESLint: '_child' is defined but never used.` 的警告。在 TypeScript 中，以 `_` 开头的参数是表示“有意未使用”的最佳实践，此配置确保 ESLint 遵循此约定。
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist'] }, // 忽略 'dist' 目录下的文件，不进行 ESLint 检查
    {
        // 针对 TypeScript 和 TSX 文件的配置
        files: ['**/*.{ts,tsx}'],
        // 继承推荐的 ESLint 和 TypeScript ESLint 规则集
        extends: [
            js.configs.recommended, // 继承 ESLint 官方的推荐规则
            ...tseslint.configs.recommended, // 继承 TypeScript ESLint 插件的推荐规则
        ],
        // 语言选项配置
        languageOptions: {
            ecmaVersion: 2020, // ECMAScript 版本设置为 2020
            globals: globals.browser, // 定义浏览器环境的全局变量
        },
        // 插件配置
        plugins: {
            'react-hooks': reactHooks, // 启用 React Hooks 相关的 ESLint 规则
            'react-refresh': reactRefresh, // 启用 React Refresh 相关的 ESLint 规则
        },
        // 具体规则配置
        rules: {
            // 继承 React Hooks 插件的推荐规则
            ...reactHooks.configs.recommended.rules,
            // 配置 'react-refresh/only-export-components' 规则，允许常量导出
            'react-refresh/only-export-components': [
                'warn', // 警告级别
                { allowConstantExport: true }, // 允许常量导出
            ],
            // 【核心修改】配置 @typescript-eslint/no-unused-vars 规则
            // 解决以 '_' 开头的参数被 ESLint 标记为未使用的警告
            '@typescript-eslint/no-unused-vars': [
                'warn', // 将其设置为警告级别，也可以是 'error'
                {
                    argsIgnorePattern: '^_', // 忽略以 '_' 开头的函数参数
                    varsIgnorePattern: '^_', // 忽略以 '_' 开头的变量
                    caughtErrorsIgnorePattern: '^_', // 忽略以 '_' 开头的 catch 块错误变量
                },
            ],
            // 禁用 ESLint 自身的 no-unused-vars 规则，因为已使用 @typescript-eslint 的版本
            'no-unused-vars': 'off',
        },
    },
);