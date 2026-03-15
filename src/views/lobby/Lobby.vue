<template>
  <div class="lobby-page">
    
    <NavBar activeMenu="lobby" />

    <main class="main-content">
      
      <div class="sticky-filter">
        
        <van-search 
          v-model="searchKeyword" 
          placeholder="搜索您想要的极品账号" 
          shape="round" 
          background="transparent" 
          class="lobby-search mobile-only"
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
            <div class="account-card" v-for="item in accountList" :key="item.id" @click="goToDetail(item.id)">
              <div class="card-cover">
                <img :src="item.cover" />
                <span class="tag">{{ item.tags[0] }}</span>
              </div>
              <div class="card-info">
                <h4 class="title">{{ item.title }}</h4>
                <div class="price-row">
                  <span class="price">￥<b>{{ item.price }}</b>/小时</span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const searchKeyword = ref('');
const gameFilter = ref(0);
const sortFilter = ref('default');
const router = useRouter();

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

const onLoad = () => {
  setTimeout(() => {
    const mockData = [
      { id: Math.random(), title: '【秒发】V10全英雄全皮肤/绝版武则天', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', tags: ['包赔'], price: '5.8' },
      { id: Math.random(), title: '和平精英 玛莎拉蒂/火箭少女101退游甩', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', tags: ['特价'], price: '4.0' },
    ];
    accountList.value.push(...mockData);
    loading.value = false;
    if (accountList.value.length >= 10) finished.value = true;
  }, 1000);
};

const goToDetail = (id) => {
  router.push(`/detail/${id}`);
};
</script>

<style scoped>
.lobby-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  color: #fff;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0 15px 0; /* 留出 NavBar 的 60px 空间 */
}

/* 吸顶筛选区 */
.sticky-filter {
  position: sticky;
  top: 60px; /* 吸顶位置在 Header 下方 */
  z-index: 99;
  background: #171c26;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  padding-bottom: 5px;
}

/* 手机端搜索框透明化 */
.lobby-search { background: transparent !important; padding: 10px 15px 5px 15px; }
:deep(.lobby-search .van-search__content) { background: rgba(0, 0, 0, 0.25) !important; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s; }
:deep(.lobby-search .van-field__control) { color: #fff; }

/* 下拉菜单暗黑化 */
:deep(.van-dropdown-menu__bar) { background: transparent; box-shadow: none; height: 40px; }
:deep(.van-dropdown-menu__title) { color: rgba(255, 255, 255, 0.9); font-size: 14px; }
:deep(.van-dropdown-menu__title::after) { border-color: transparent transparent rgba(255, 255, 255, 0.7) rgba(255, 255, 255, 0.7); }
:deep(.van-dropdown-item__content) { background: #171c26; border-radius: 0 0 12px 12px; } 
:deep(.van-cell) { background: transparent; color: rgba(255, 255, 255, 0.8); }
:deep(.van-cell::after) { border-bottom: 1px solid rgba(255,255,255,0.05); } 
:deep(.van-dropdown-item__option--active) { color: #00e5ff; background: rgba(0, 229, 255, 0.05); } 
:deep(.van-dropdown-item__option--active .van-dropdown-item__icon) { color: #00e5ff; }

.list-container { padding: 15px; }

/* 卡片样式复用 */
.account-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
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
  .responsive-account-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 15px; }
}

/* 💻 PC 端适配 */
@media (min-width: 768px) {
  .mobile-only { display: none !important; }
  .sticky-filter { border-radius: 12px; margin: 20px 15px; }
  .responsive-account-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .card-cover { height: 160px; } 
  .title { font-size: 15px; margin-bottom: 15px; }
}
</style>