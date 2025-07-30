/**
 * 文件名: jest.config.cjs
 *
 * 文件功能描述:
 * 此文件是 Jest 的核心配置文件。
 *
 * 本次修改内容:
 * - 【配置对齐】将 `ts-jest` 的 `tsconfig` 选项指向了新建的 `tsconfig.test.json`。
 * - **目的**: 确保 Jest 在运行测试时，使用我们为其量身定制的、兼容 CommonJS 环境的
 *   TypeScript 配置，从而从根本上解决所有模块系统和类型定义相关的错误。
 */
module.exports = {
    testEnvironment: 'jsdom',
    testMatch: [
        '**/__tests__/**/*.test.[jt]s?(x)',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        // 【核心修复】将 tsconfig 指向 tsconfig.test.json
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json', // <--- 修改这一行
            },
        ],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};