import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useSiteBrandingStore } from './stores/siteBranding'
import './assets/main.css'

import vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vant)

useSiteBrandingStore().fetchBranding().catch(() => {})
app.mount('#app')