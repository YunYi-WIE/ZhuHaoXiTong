<template>
  <div class="responsive-home-page">
    
    <header class="responsive-header">
      <div class="header-inner">
        <div class="logo-box" @click="goTo('/')">
          <img src="@/assets/logo.png" class="logo-img glow-effect" />
          <span class="brand-name neon-text">哈小龙小店</span>
        </div>

        <nav class="desktop-nav desktop-only">
          <span class="nav-item active" @click="goTo('/')">首页</span>
          <span class="nav-item" @click="goTo('/lobby')">租号大厅</span>
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

    <main class="main-content">
      
      <div class="mobile-search-wrap mobile-only">
        <van-search 
          v-model="searchKeyword" 
          placeholder="搜索您想要的极品账号" 
          shape="round" 
          background="transparent" 
          class="custom-search"
          @search="handleSearch"
        />
      </div>

      <div class="banner-wrap">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(img, index) in bannerList" :key="index">
            <img :src="img" class="banner-img active-shadow" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <van-grid :column-num="4" :border="false" class="nav-grid esports-grid">
        <van-grid-item text="王者荣耀" @click="goTo('/lobby')">
          <template #icon><van-icon name="fire-o" class="grid-icon neon-fire" /></template>
        </van-grid-item>
        <van-grid-item text="和平精英" @click="goTo('/lobby')">
          <template #icon><van-icon name="aim" class="grid-icon neon-aim" /></template>
        </van-grid-item>
        <van-grid-item text="极品连体" @click="goTo('/lobby')">
          <template #icon><van-icon name="gem-o" class="grid-icon neon-gem" /></template>
        </van-grid-item>
        <van-grid-item text="特价捡漏" @click="goTo('/lobby')">
          <template #icon><van-icon name="gift-o" class="grid-icon neon-gift" /></template>
        </van-grid-item>
      </van-grid>

      <div class="list-section">
        <h3 class="section-title neon-section-title">
          精选好号 <span class="subtitle">官方包赔 放心租</span>
        </h3>
        
        <div class="responsive-account-grid">
          <div 
            v-for="item in hotAccounts" 
            :key="item.id" 
            class="account-card"
            @click="goToDetail(item.id)"
          >
            <div class="card-cover">
              <img :src="item.cover" />
              <span class="tag">{{ item.tag }}</span>
            </div>
            <div class="card-info">
              <h4 class="title">{{ item.title }}</h4>
              <div class="price-row">
                <span class="price">￥<b>{{ item.price }}</b>/小时</span>
              </div>
            </div>
          </div>
        </div>
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

const router = useRouter();
const searchKeyword = ref('');
const showHelp = ref(false);

const bannerList = ref([
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200'
]);

const hotAccounts = ref([
  { id: 1, title: '【秒发】V10全英雄全皮肤/武则天', price: '5.80', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', tag: '包赔' },
  { id: 2, title: '和平精英 玛莎拉蒂/火箭少女101', price: '4.00', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', tag: '免押' },
  { id: 3, title: '原神 满命夜兰/极品深渊号', price: '6.50', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', tag: '包赔' },
  { id: 4, title: '永劫无间 极品皮肤全套', price: '3.20', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', tag: '优惠' },
  { id: 5, title: '金铲铲之战 全棋盘全特效', price: '2.50', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', tag: '热租' }
]);

const handleSearch = () => {
  if (!searchKeyword.value) return;
  router.push({ path: '/lobby', query: { q: searchKeyword.value } });
};

const goTo = (path) => router.push(path);
const goToDetail = (id) => router.push(`/detail/${id}`);
</script>

<style scoped>
/* =========================================
   全局基础与电竞风主题设定
   ========================================= */
.responsive-home-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  color: #fff;
}

/* =========================================
   响应式顶部导航栏
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

/* 搜索框玻璃质感通用样式 */
:deep(.custom-search) { padding: 0 !important; background: transparent !important; }
:deep(.custom-search .van-search__content) {
  background: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px !important;
}
:deep(.van-field__control) { color: #fff !important; }
:deep(.van-field__control::placeholder) { color: rgba(255, 255, 255, 0.6) !important; }

/* =========================================
   主体内容区
   ========================================= */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 15px 15px 15px; /* 上边距避开导航栏 */
}

.banner-wrap { border-radius: 12px; overflow: hidden; margin: 10px 0 20px 0; transform: translateZ(0); }
.banner-img { width: 100%; height: 160px; object-fit: cover; display: block; }

.nav-grid { margin-bottom: 20px; }
:deep(.esports-grid .van-grid-item__content) { 
  background: rgba(23, 28, 38, 0.8) !important; 
  border-radius: 10px; margin: 0 5px; padding: 15px 0; 
}
:deep(.van-grid-item__text) { color: #bbb !important; margin-top: 8px; font-size: 12px; }
.grid-icon { font-size: 28px; }
.neon-fire { color: #ff3b30; text-shadow: 0 0 8px #ff3b30; }
.neon-aim { color: #07c160; text-shadow: 0 0 8px #07c160; }
.neon-gem { color: #6f42c1; text-shadow: 0 0 8px #6f42c1; }
.neon-gift { color: #ff9500; text-shadow: 0 0 8px #ff9500; }

.section-title { font-size: 18px; margin-bottom: 15px; display: flex; align-items: baseline; gap: 10px; }
.neon-section-title { text-shadow: 0 0 5px rgba(255,255,255,0.4); }
.subtitle { font-size: 12px; color: #ddd; font-weight: normal; }

/* 🚀 账号卡片通用样式 */
.account-card {
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;
}
.account-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
.card-cover { height: 140px; position: relative; background: #eee; }
.card-cover img { width: 100%; height: 100%; object-fit: cover; }
.card-cover .tag { position: absolute; top: 8px; left: 8px; background: #ff3b30; color: #fff; font-size: 10px; padding: 3px 6px; border-radius: 4px; }
.card-info { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.title { color: #333; font-size: 14px; font-weight: bold; margin: 0 0 10px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.price { color: #ff3b30; font-size: 12px; }
.price b { font-size: 20px; }

/* =========================================
   ✨ 核心：纯 CSS 响应式媒体查询
   ========================================= */

/* --- 手机端特有 --- */
@media (max-width: 767px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block; }
  
  .responsive-account-grid {
    display: grid;
    /* 手机端 2 列，最小自动缩小填满 */
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

/* --- 平板与 PC 端特有 (>= 768px) --- */
@media (min-width: 768px) {
  .mobile-only { display: none !important; }
  .desktop-only { display: flex !important; }
  
  /* 1. PC 顶部导航菜单 */
  .desktop-nav { display: flex; gap: 30px; margin-left: 40px; }
  .nav-item { color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: bold; cursor: pointer; position: relative; transition: all 0.3s; }
  .nav-item:hover { color: #fff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.6); }
  .nav-item.active { color: #00e5ff; }
  .nav-item.active::after {
    content: ''; position: absolute; bottom: -8px; left: 50%;
    transform: translateX(-50%); width: 20px; height: 3px;
    background: #00e5ff; border-radius: 2px; box-shadow: 0 0 8px #00e5ff;
  }

  /* 2. 搜索框：提亮变通透 */
  .desktop-search { flex: 1; max-width: 380px; margin: 0 40px; }
  :deep(.desktop-search .van-search__content) {
    background: rgba(255, 255, 255, 0.1) !important; /* 稍微提亮一点 */
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
  }
  :deep(.desktop-search .van-search__content:hover) {
    background: rgba(255, 255, 255, 0.15) !important;
  }

  /* 3. 轮播图：加大气场 */
  .banner-wrap { margin-top: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .banner-img { height: 400px; } 

  /* 🚀 4. 核心拯救：改造“四个巨型砖块” */
  .nav-grid { 
    padding: 0 12% !important; /* 魔法：左右往中间挤压，让方块变精致 */
    margin-top: 35px; 
    margin-bottom: 45px; 
  }
  :deep(.esports-grid .van-grid-item__content) { 
    background: rgba(23, 28, 38, 0.4) !important; /* 降低底色浓度，透出渐变背景 */
    backdrop-filter: blur(10px); /* 磨砂玻璃质感 */
    border: 1px solid rgba(255, 255, 255, 0.08); /* 加一圈极细的高光边 */
    padding: 30px 0; 
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  /* PC端专属 Hover 悬浮特效 */
  :deep(.esports-grid .van-grid-item__content:hover) {
    background: rgba(23, 28, 38, 0.8) !important;
    border-color: rgba(0, 229, 255, 0.5); /* 边框发荧光蓝 */
    transform: translateY(-8px); /* 向上浮起 */
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  .grid-icon { font-size: 48px; margin-bottom: 12px; }
  :deep(.van-grid-item__text) { font-size: 15px !important; color: #fff !important; }

  /* 5. 标题行：增加重量感和分割线 */
  .section-title { 
    font-size: 24px; 
    margin-bottom: 25px; 
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15); /* 加一条底线，像真正的PC网站 */
  }
  .subtitle { font-size: 14px; opacity: 0.8; margin-left: 10px; }

  /* 6. 账号列表：严格规范为 4 列，不再自动拉伸 */
  .responsive-account-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 强制等比 4 列 */
    gap: 25px;
  }
  .card-cover { height: 160px; } 
  .title { font-size: 15px; margin-bottom: 15px; }
}
</style>