/********************************************************************
 *  vite.config.ts                                                  *
 *  ----------------------------------------------------------------
 *  • 支持 React、SVG 转组件、路径别名 @ → src                      *
 *  • 同时兼顾开发体验 (Fast Refresh) 与生产构建 (手动拆包示例)      *
 *  • 每行均附中文注释，方便初学者理解                              *
 ********************************************************************/

import { defineConfig, loadEnv } from 'vite'        // defineConfig 提供类型提示；loadEnv 读取 .env
import react from '@vitejs/plugin-react'            // 官方 React 插件：JSX、Fast Refresh
import svgr from 'vite-plugin-svgr'                 // 将 .svg 转成 React 组件
import { resolve } from 'node:path'                 // Node-ESM 推荐写法，用于解析绝对路径

// -----------------------------------------------------------------
// 以函数形式导出配置，可根据运行模式 (mode) 动态读取环境变量
// -----------------------------------------------------------------
export default defineConfig(({ mode }) => {
  /* 读取 .env、.env.development、.env.production 等，合并到 process.env */loadEnv(mode, process.cwd());


  /* 返回 Vite 配置对象 */
  return {
    /* ================= 基础公共路径 ================= */
    base: './',                                     // 相对路径部署，生成文件引用 ./assets/xxx

    /* ================= 插 件 ================= */
    plugins: [
      react(),                                      // React + Fast Refresh
      svgr(),                                       // 让你可以：import { ReactComponent as Logo } from './logo.svg'
    ],

    /* ================= 路径别名 ================= */
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),             // “@” 指向 src 目录，写 import '@/xyz'
      },
    },

    /* ================= CSS / 预处理 ================= */
    css: {
      preprocessorOptions: {
        scss: {
          /* 每个 .scss 文件都会自动注入这一行，可全局使用变量与 mixin */
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },

    /* ================= 开 发 服 务 器 ================= */
    server: {
      host: '0.0.0.0',      // 允许局域网 / Docker 访问
      port: 3000,           // 开发端口
      open: true,           // 启动后自动打开浏览器
      strictPort: true,     // 若端口被占用则直接报错，不自动递增
    },

    /* ================= 生 产 构 建 ================= */
    build: {
      outDir: 'dist',               // 打包输出目录
      emptyOutDir: true,            // 构建前清空
      sourcemap: false,             // 关闭 source map（体积更小）
      chunkSizeWarningLimit: 1500,  // 当某个 chunk >1.5MB 时给警告
      rollupOptions: {
        /* 手动拆包示例：把 node_modules 统一打进 vendor.[hash].js */
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },
    },

    /* ================= 依赖预打包优化 ================= */
    optimizeDeps: {
      /* 手动列出大依赖，可加快首次 dev 启动速度 */
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
