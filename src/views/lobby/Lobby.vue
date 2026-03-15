<template>
  <div class="lobby-page">
    
    <header class="responsive-header">
      <div class="header-inner">
        <div class="logo-box" @click="goTo('/')">
          <img src="@/assets/logo.png" class="logo-img glow-effect" />
          <span class="brand-name neon-text">哈小龙小店</span>
        </div>

        <nav class="desktop-nav desktop-only">
          <span class="nav-item" @click="goTo('/')">首页</span>
          <span class="nav-item active" @click="goTo('/lobby')">租号大厅</span>
        </nav>

        <div class="header-actions">
          <span class="desktop-only login-text" @click="goTo('/login')">登录/注册</span>
          <van-icon name="chat-o" size="24" class="cs-icon neon-cs" @click="showHelp = true" />
        </div>
      </div>
    </header>

    <main class="main-content">
      
      <div class="sticky-filter">
        <van-search 
          v-model="searchKeyword" 
          placeholder="搜索您想要的极品账号" 
          shape="round" 
          background="transparent" 
          class="lobby-search"
        />
        
        <van-dropdown-menu active-color="#00e5ff" class="custom-dropdown">
          <van-dropdown-item v-model="gameFilter" :options="gameOptions" />
          <van-dropdown-item v-model="sortFilter" :options="sortOptions" />
        </van-dropdown-menu>
      </div>

      <div class="list-container">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="~ 到底啦 ~"
          @load="onLoad"
        >
          <div class="responsive-account-grid">
            <AccountCard 
              v-for="item in accountList" 
              :key="item.id" 
              :item="item" 
            />
          </div>
        </van-list>
      </div>
    </main>

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
import AccountCard from '@/components/AccountCard.vue'; 

const router = useRouter();
const searchKeyword = ref('');
const gameFilter = ref(0);
const sortFilter = ref('default');
const showHelp = ref(false);

const gameOptions = [
  { text: '全部游戏', value: 0 },
  { text: '王者荣耀', value: 1 },
  { text: '和平精英', value: 2 },
  { text: '原神', value: 3 },
];

const sortOptions = [
  { text: '综合排序', value: 'default' },
  { text: '价格最低', value: 'priceAsc' },
  { text: '最新上架', value: 'newest' },
];

const accountList = ref([]);
const loading = ref(false);
const finished = ref(false);

const goTo = (path) => {
  router.push(path);
};

const onLoad = () => {
  setTimeout(() => {
    const mockData = [
      { id: Math.random(), title: '【秒发】V10全英雄全皮肤/绝版武则天', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '安卓QQ区', tags: ['包赔', '极品号'], price: '5.8', isBao: true },
      { id: Math.random(), title: '和平精英 玛莎拉蒂/火箭少女101退游甩', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '苹果微信', tags: ['可排位'], price: '4.0', isBao: false },
      { id: Math.random(), title: '【秒发】V10全英雄全皮肤/绝版武则天', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '安卓QQ区', tags: ['包赔', '极品号'], price: '5.8', isBao: true },
      { id: Math.random(), title: '和平精英 玛莎拉蒂/火箭少女101退游甩', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '苹果微信', tags: ['可排位'], price: '4.0', isBao: false }
    ];
    accountList.value.push(...mockData);
    loading.value = false;
    if (accountList.value.length >= 20) finished.value = true;
  }, 1000);
};
</script>

<style scoped>
/* =========================================
   全局基础与电竞风主题设定
   ========================================= */
.lobby-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  color: #fff;
}

/* =========================================
   响应式顶部导航栏 (同首页)
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
  max-width: 1200px; 
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
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

/* =========================================
   主体内容区
   ========================================= */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0 20px 0; /* 顶部留出 header 的 60px */
}

/* =========================================
   悬浮的搜索与筛选区
   ========================================= */
.sticky-filter {
  position: sticky;
  top: 60px; /* 🚀 核心魔法：吸顶位置正好在 header 的下方 */
  z-index: 99;
  background: #171c26;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  padding-bottom: 5px;
}

/* 搜索框透明化 */
.lobby-search { background: transparent !important; padding: 10px 15px 5px 15px; }
:deep(.lobby-search .van-search__content) { background: rgba(0, 0, 0, 0.25) !important; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s; }
:deep(.lobby-search .van-search__content:focus-within) { border-color: #00e5ff; box-shadow: 0 0 8px rgba(0, 229, 255, 0.4); }
:deep(.lobby-search .van-field__control) { color: #fff; }
:deep(.lobby-search .van-field__control::placeholder) { color: rgba(255, 255, 255, 0.6); }

/* 下拉菜单暗黑化 */
:deep(.van-dropdown-menu__bar) { background: transparent; box-shadow: none; height: 40px; }
:deep(.van-dropdown-menu__title) { color: rgba(255, 255, 255, 0.9); font-size: 14px; }
:deep(.van-dropdown-menu__title::after) { border-color: transparent transparent rgba(255, 255, 255, 0.7) rgba(255, 255, 255, 0.7); }
:deep(.van-dropdown-item__content) { background: #171c26; border-radius: 0 0 12px 12px; } 
:deep(.van-cell) { background: transparent; color: rgba(255, 255, 255, 0.8); }
:deep(.van-cell::after) { border-bottom: 1px solid rgba(255,255,255,0.05); } 
:deep(.van-dropdown-item__option--active) { color: #00e5ff; background: rgba(0, 229, 255, 0.05); } 
:deep(.van-dropdown-item__option--active .van-dropdown-item__icon) { color: #00e5ff; }

/* 列表容器 */
.list-container { padding: 15px; }

/* =========================================
   ✨ 核心：纯 CSS 响应式媒体查询
   ========================================= */

/* --- 手机端特有 --- */
@media (max-width: 767px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block; }
  
  .responsive-account-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr); /* 手机端单列更清晰 */
    gap: 15px;
  }
}

/* --- 平板与 PC 端特有 (>= 768px) --- */
@media (min-width: 768px) {
  .mobile-only { display: none !important; }
  .desktop-only { display: flex !important; }
  
  /* PC 顶部导航菜单 */
  .desktop-nav {
    display: flex;
    gap: 30px;
    margin-left: 40px;
  }
  .nav-item {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
  }
  .nav-item:hover { color: #fff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.6); }
  .nav-item.active { color: #00e5ff; }
  .nav-item.active::after {
    content: ''; position: absolute; bottom: -8px; left: 50%;
    transform: translateX(-50%); width: 20px; height: 3px;
    background: #00e5ff; border-radius: 2px; box-shadow: 0 0 8px #00e5ff;
  }
  
  /* PC 端筛选区限制圆角，避免贴边 */
  .sticky-filter {
    border-radius: 12px;
    margin: 20px 15px;
  }

  .responsive-account-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 🚀 因为AccountCard是横向卡片，PC端使用双列排版最优雅 */
    gap: 20px;
  }
}
</style>