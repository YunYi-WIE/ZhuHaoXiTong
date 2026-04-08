<template>
  <div class="nav-placeholder">
    <header class="responsive-header">
      <div class="header-inner">
        <div class="logo-box" @click="goTo('/home')">
          <img :src="brandLogo" class="logo-img" alt="" />
          <span class="brand-name">{{ siteName }}</span>
        </div>

        <nav class="desktop-nav desktop-only">
          <span class="nav-item" :class="{ active: route.path === '/home' }" @click="goTo('/home')">首页</span>
          <span class="nav-item" :class="{ active: route.path === '/lobby' }" @click="goTo('/lobby')">账号大厅</span>
          <span class="nav-item" :class="{ active: route.path === '/publish' }" @click="goTo('/publish')">我要发布</span>
          <span class="nav-item" :class="{ active: route.path === '/message' }" @click="goTo('/message')">消息中心</span>
        </nav>

        <div class="desktop-search desktop-only">
          <van-search v-model="searchKeyword" placeholder="搜索极品账号" shape="round" background="transparent" class="custom-search" @search="handleSearch" />
        </div>

        <div class="header-actions">
          <span v-if="!isLoggedIn" class="desktop-only login-text" @click="goTo('/login')">登录 / 注册</span>
          <div v-else class="desktop-only user-menu" @click="goTo('/mine')">
            <van-icon name="user-circle-o" size="20" />
            <span>个人中心</span>
          </div>
          <div class="mobile-actions">
            <van-icon name="chat-o" size="20" @click="goTo('/message')" />
            <van-icon :name="isLoggedIn ? 'contact' : 'user-o'" size="20" @click="goTo(isLoggedIn ? '/mine' : '/login')" />
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useSiteBrandingStore } from '@/stores/siteBranding';

const branding = useSiteBrandingStore();
const { siteName, effectiveLogo: brandLogo } = storeToRefs(branding);

const router = useRouter();
const route = useRoute(); // 用于判断当前页面高亮
const searchKeyword = ref('');
const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token');
});

const handleSearch = () => {
  if (!searchKeyword.value) return;
  router.push({ path: '/lobby', query: { q: searchKeyword.value } });
};
const goTo = (path) => router.push(path);
</script>

<style scoped>
.nav-placeholder { height: 60px; }
.responsive-header { 
  position: fixed; top: 0; left: 0; right: 0; height: 60px; 
  /* 🚀 改为纯白背景，浅色下边框 */
  background: #ffffff; 
  border-bottom: 1px solid #edf2f9;
  z-index: 1000; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.header-inner { max-width: 1200px; margin: 0 auto; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; }

/* 品牌 Logo 改为深色文字 */
.logo-box { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.logo-img { width: 32px; height: 32px; border-radius: 6px; }
.brand-name { font-size: 18px; font-weight: 900; color: #333; letter-spacing: 1px; }

/* 手机端隐藏桌面元素 */
@media (max-width: 767px) { 
  .desktop-only { display: none !important; } 
  .brand-name { font-size: 16px; letter-spacing: 0.5px; }
}

/* 平板与桌面：保留导航，压缩间距 */
@media (min-width: 768px) and (max-width: 1099px) {
  .desktop-only { display: flex !important; }
  .desktop-nav { display: flex; gap: 18px; margin-left: 18px; }
  .desktop-search { flex: 1; max-width: 220px; margin: 0 16px; }
  .nav-item { font-size: 14px; }
  .header-actions { display: flex; align-items: center; gap: 12px; }
}

/* 大屏桌面样式 */
@media (min-width: 1100px) {
  .desktop-only { display: flex !important; }
  .desktop-nav { display: flex; gap: 30px; margin-left: 50px; }
  
  .nav-item { color: #555; font-size: 16px; font-weight: 600; cursor: pointer; position: relative; transition: color 0.3s; }
  .nav-item:hover { color: #1989fa; }
  .nav-item.active { color: #1989fa; }
  .nav-item.active::after { content: ''; position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: #1989fa; border-radius: 2px; }
  
  .desktop-search { flex: 1; max-width: 380px; margin: 0 40px; }
  :deep(.custom-search) { padding: 0 !important; background: transparent !important; }
  :deep(.custom-search .van-search__content) { background: #f0f3f6 !important; border-radius: 20px !important; }
  :deep(.custom-search .van-field__control) { color: #333 !important; }
  
  .header-actions { display: flex; align-items: center; gap: 20px; }
  .login-text, .user-menu { font-size: 14px; color: #555; cursor: pointer; font-weight: 600; transition: color 0.2s; display: flex; align-items: center; gap: 5px; }
  .login-text:hover, .user-menu:hover { color: #1989fa; }
}

.mobile-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #475569;
}

@media (min-width: 768px) {
  .mobile-actions {
    display: none;
  }
}
</style>