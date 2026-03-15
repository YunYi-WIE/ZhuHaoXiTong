<template>
  <div>
    <header class="responsive-header">
      <div class="header-inner">
        <div class="logo-box" @click="goTo('/')">
          <img src="@/assets/logo.png" class="logo-img glow-effect" />
          <span class="brand-name neon-text">哈小龙小店</span>
        </div>

        <nav class="desktop-nav desktop-only">
          <span 
            class="nav-item" 
            :class="{ active: activeMenu === 'home' }" 
            @click="goTo('/')"
          >首页</span>
          <span 
            class="nav-item" 
            :class="{ active: activeMenu === 'lobby' }" 
            @click="goTo('/lobby')"
          >租号大厅</span>
        </nav>

        <div class="desktop-search desktop-only">
          <van-search 
            v-model="searchKeyword" 
            placeholder="搜索您想要的极品账号" 
            shape="round" 
            background="transparent" 
            class="custom-search"
            @search="handleSearch"
          />
        </div>

        <div class="header-actions">
          <span class="desktop-only login-text" @click="goTo('/login')">登录/注册</span>
          <van-icon name="chat-o" size="24" class="cs-icon neon-cs" @click="showHelp = true" />
        </div>
      </div>
    </header>

    <van-dialog v-model:show="showHelp" title="专属客服" show-cancel-button>
      <div style="text-align: center; padding: 20px;">
        <img src="https://fastly.jsdelivr.net/npm/@vant/assets/qrcode.png" style="width: 150px;" />
        <p style="margin-top: 10px; color: #666;">扫码添加官方客服</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 接收父组件传入的当前页面标识
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home' 
  }
});

const router = useRouter();
const searchKeyword = ref('');
const showHelp = ref(false);

const handleSearch = () => {
  if (!searchKeyword.value) return;
  router.push({ path: '/lobby', query: { q: searchKeyword.value } });
};

const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
/* =========================================
   响应式顶部导航栏 (共用样式)
   ========================================= */
.responsive-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: #171c26;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.header-inner {
  max-width: 1200px; margin: 0 auto; height: 100%;
  display: flex; align-items: center; justify-content: space-between; padding: 0 15px;
}

.logo-box { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.logo-img { width: 32px; height: 32px; border-radius: 6px; }
.glow-effect { box-shadow: 0 0 10px rgba(111, 66, 193, 0.5); }
.neon-text { font-size: 18px; font-weight: bold; color: #fff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 59, 48, 0.5); }

.header-actions { display: flex; align-items: center; gap: 20px; }
.login-text { font-size: 14px; color: #fff; cursor: pointer; transition: color 0.3s; }
.login-text:hover { color: #00e5ff; }
.cs-icon { color: #fff; cursor: pointer; }
.neon-cs:hover { text-shadow: 0 0 8px #07c160; color: #07c160; }

/* 手机端隐藏电脑专属元素 */
@media (max-width: 767px) {
  .desktop-only { display: none !important; }
}

/* 电脑端展示专属元素 */
@media (min-width: 768px) {
  .desktop-only { display: flex !important; }
  
  .desktop-nav { display: flex; gap: 30px; margin-left: 40px; }
  .nav-item { color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: bold; cursor: pointer; position: relative; transition: all 0.3s; }
  .nav-item:hover { color: #fff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.6); }
  .nav-item.active { color: #00e5ff; }
  .nav-item.active::after {
    content: ''; position: absolute; bottom: -8px; left: 50%;
    transform: translateX(-50%); width: 20px; height: 3px;
    background: #00e5ff; border-radius: 2px; box-shadow: 0 0 8px #00e5ff;
  }

  .desktop-search { flex: 1; max-width: 380px; margin: 0 40px; }
  :deep(.custom-search) { padding: 0 !important; background: transparent !important; }
  :deep(.custom-search .van-search__content) {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px !important; transition: all 0.3s;
  }
  :deep(.custom-search .van-search__content:hover) { background: rgba(255, 255, 255, 0.15) !important; }
  :deep(.custom-search .van-field__control) { color: #fff !important; }
  :deep(.custom-search .van-field__control::placeholder) { color: rgba(255, 255, 255, 0.6) !important; }
}
</style>