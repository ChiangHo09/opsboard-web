/**
 * @file vite.config.ts
 * @description 此文件是 Vite 构建工具的配置文件。
 * @modification
 *   - [Proxy Fix]: 将 `server.host` 配置注释掉。在某些环境下，`host: '0.0.0.0'` 会与 `proxy` 功能冲突，导致代理失效。让 Vite 使用默认的 `localhost` host 是最稳健的配置，可以确保代理功能正常工作。
 */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
    loadEnv(mode, process.cwd());

    return {
        base: './',
        plugins: [
            react(),
            svgr(),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/variables.scss" as *;`,
                },
            },
        },
        server: {
            // host: '0.0.0.0', // 【核心修复】注释掉此行。此设置可能导致代理在某些网络环境下失效。
            port: 5173,
            open: true,
            strictPort: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            sourcemap: false,
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                    },
                },
            },
        },
        optimizeDeps: {
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