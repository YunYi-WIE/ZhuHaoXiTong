<template>
  <div class="responsive-home-page">
    
    <NavBar activeMenu="home" />

    <main class="main-content">
      
      <div class="mobile-search-wrap mobile-only">
        <van-search 
          v-model="searchKeyword" 
          placeholder="搜索您想要的极品账号" 
          shape="round" 
          background="transparent" 
          class="mobile-custom-search"
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
          <div v-for="item in hotAccounts" :key="item.id" class="account-card" @click="goToDetail(item.id)">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const searchKeyword = ref('');

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
.responsive-home-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  color: #fff;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 15px 15px 15px; /* 上留出 NavBar 空间，下留出 Tabbar 空间 */
}

/* 手机端搜索框磨砂样式 */
:deep(.mobile-custom-search) { padding: 10px 0 !important; }
:deep(.mobile-custom-search .van-search__content) {
  background: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px !important;
}
:deep(.van-field__control) { color: #fff !important; }

/* 轮播与金刚区 */
.banner-wrap { border-radius: 12px; overflow: hidden; margin: 10px 0 20px 0; transform: translateZ(0); }
.banner-img { width: 100%; height: 160px; object-fit: cover; display: block; }
.nav-grid { margin-bottom: 20px; }
:deep(.esports-grid .van-grid-item__content) { background: rgba(23, 28, 38, 0.8) !important; border-radius: 10px; margin: 0 5px; padding: 15px 0; }
:deep(.van-grid-item__text) { color: #bbb !important; margin-top: 8px; font-size: 12px; }
.grid-icon { font-size: 28px; }
.neon-fire { color: #ff3b30; text-shadow: 0 0 8px #ff3b30; }
.neon-aim { color: #07c160; text-shadow: 0 0 8px #07c160; }
.neon-gem { color: #6f42c1; text-shadow: 0 0 8px #6f42c1; }
.neon-gift { color: #ff9500; text-shadow: 0 0 8px #ff9500; }

.section-title { font-size: 18px; margin-bottom: 15px; display: flex; align-items: baseline; gap: 10px; text-shadow: 0 0 5px rgba(255,255,255,0.4); }
.subtitle { font-size: 12px; color: #ddd; font-weight: normal; }

/* 账号卡片 */
.account-card {
  background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column;
}
.account-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
.card-cover { height: 140px; position: relative; background: #eee; }
.card-cover img { width: 100%; height: 100%; object-fit: cover; }
.card-cover .tag { position: absolute; top: 8px; left: 8px; background: #ff3b30; color: #fff; font-size: 10px; padding: 3px 6px; border-radius: 4px; }
.card-info { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.title { color: #333; font-size: 14px; font-weight: bold; margin: 0 0 10px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.price { color: #ff3b30; font-size: 12px; }
.price b { font-size: 20px; }

/* 📱 手机端适配 */
@media (max-width: 767px) {
  .mobile-only { display: block; }
  .responsive-account-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
}

/* 💻 PC 端适配 */
@media (min-width: 768px) {
  .mobile-only { display: none !important; }
  
  .banner-wrap { margin-top: 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .banner-img { height: 400px; } 

  .nav-grid { padding: 0 12% !important; margin-top: 35px; margin-bottom: 45px; }
  :deep(.esports-grid .van-grid-item__content) { 
    background: rgba(23, 28, 38, 0.4) !important; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); padding: 30px 0; border-radius: 16px; transition: all 0.3s;
  }
  :deep(.esports-grid .van-grid-item__content:hover) { background: rgba(23, 28, 38, 0.8) !important; border-color: rgba(0, 229, 255, 0.5); transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); }
  .grid-icon { font-size: 48px; margin-bottom: 12px; }
  :deep(.van-grid-item__text) { font-size: 15px !important; color: #fff !important; }

  .section-title { font-size: 24px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); }
  
  .responsive-account-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
  .card-cover { height: 160px; } 
  .title { font-size: 15px; margin-bottom: 15px; }
}
</style>