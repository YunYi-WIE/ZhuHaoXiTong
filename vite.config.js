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
  // 👇 新增：配置开发服务器跨域代理
  server: {
    // 🚀 新增：允许局域网和公网访问
    host: '0.0.0.0', 
    // 🚀 新增：把你的 cpolar 域名加入白名单
    allowedHosts: [
      '5b5fd72b.r38.cpolar.top', // 你当前的域名
      '.cpolar.top'              // 加上这个泛域名，以后 cpolar 域名变了也不用再改代码！
    ],
    proxy: {
      '/api': {
        target: 'http://ce77d45.r39.cpolar.top', // 你的后端接口地址
        changeOrigin: true, // 允许跨域
        // 如果后端接口本身就带有 /api，这里就不用 rewrite
      }
    }
  }
})