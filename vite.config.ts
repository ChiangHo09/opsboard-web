import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  plugins: [
    react(),  // React 插件，支持 JSX、TSX 等
    svgr(),   // SVG 转 React 组件插件
  ],
  resolve: {
    alias: {
      '@': '/src',  // 可选：给 src 目录起个别名，方便导入
    },
  },
  server: {
    port: 3000,      // 开发服务器端口，可改
    open: true,      // 启动后自动打开浏览器
  },
  build: {
    outDir: 'dist',  // 打包输出目录
  },
});
