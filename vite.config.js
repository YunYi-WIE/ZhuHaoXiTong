import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // --- 重点加这块：服务器代理配置 ---
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // 【关键】这里换成后端实际给您的接口测试地址
        target: 'http://backend-server-address.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})