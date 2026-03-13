import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 引入 Vant (H5端用到)
import vant from 'vant';
import 'vant/lib/index.css';

// 👇 新增：引入 Element Plus (PC端用到)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vant)
app.use(ElementPlus) // 👇 新增这行

app.mount('#app')