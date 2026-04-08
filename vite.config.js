import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('vant')) return 'vant'
          if (id.includes('vue-router') || id.includes('pinia') || id.includes('/vue/'))
            return 'vue-vendor'
          if (id.includes('axios')) return 'axios'
          if (id.includes('qrcode')) return 'qrcode'
        },
      },
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 👇 注意！server 必须和 plugins、resolve 是平级的（同级兄弟节点）
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 8080,
    proxy: {
      // 只要请求路径以 /api 开头，就会被转发到 target
      '/api': {
        target: 'http://localhost:26080',
        changeOrigin: true
      },
      // 如果后台接口以 /admin 开头，也一并转发
      '/admin': {
        target: 'http://localhost:26080',
        changeOrigin: true
      }
    }
  }
})