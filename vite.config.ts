/**
 * 文件名: vite.config.ts
 *
 * 文件功能描述:
 * 此文件是 Vite 构建工具的配置文件。它负责定义整个项目的前端构建、开发服务器行为、
 * 插件集成和优化策略。核心功能包括：
 * - 启用 React 支持（通过 @vitejs/plugin-react）。
 * - 配置路径别名，使构建工具能够解析源代码中的 `@/` 路径。
 * - 配置开发服务器（如端口、自动打开）。
 * - 定义生产环境的打包优化规则（如代码分割）。
 *
 * 本次修改内容:
 * - 【路径别名配置】在 `resolve.alias` 选项中添加了 `@` 指向 `src` 目录的配置。
 *   这个配置与 `tsconfig.app.json` 中的 `paths` 设置相对应，确保了 Vite 在
 *   编译和打包过程中能正确地解析绝对路径别名，是实现该功能不可或缺的一环。
 * - 【代码整合】集成了用户提供的详细配置模板，并进行了标准化。
 */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  // 读取 .env、.env.development、.env.production 等，合并到 process.env
  loadEnv(mode, process.cwd());

  // 返回 Vite 配置对象
  return {
    // 基础公共路径，相对路径部署，生成文件引用 ./assets/xxx
    base: './',

    // 插件
    plugins: [
      react(), // React + Fast Refresh
      svgr(),  // 将 .svg 转成 React 组件: import { ReactComponent as Logo } from './logo.svg'
    ],

    // 路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'), // “@” 指向 src 目录
      },
    },

    // CSS / 预处理
    css: {
      preprocessorOptions: {
        scss: {
          // 每个 .scss 文件都会自动注入这一行，可全局使用变量与 mixin
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },

    // 开发服务器
    server: {
      host: '0.0.0.0',      // 允许局域网 / Docker 访问
      port: 5173,           // 开发端口
      open: true,           // 启动后自动打开浏览器
      strictPort: true,     // 若端口被占用则直接报错，不自动递增
    },

    // 生产构建
    build: {
      outDir: 'dist',               // 打包输出目录
      emptyOutDir: true,            // 构建前清空
      sourcemap: false,             // 关闭 source map（体积更小）
      chunkSizeWarningLimit: 1500,  // 当某个 chunk >1.5MB 时给警告
      rollupOptions: {
        // 手动拆包示例：把 node_modules 统一打进 vendor.[hash].js
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },
    },

    // 依赖预打包优化
    optimizeDeps: {
      // 手动列出大依赖，可加快首次 dev 启动速度
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@mui/icons-material',
      ],
    },
  }
})