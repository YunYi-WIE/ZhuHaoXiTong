<template>
  <div class="lobby-page esports-theme">
    <van-sticky>
      <div class="header-wrap">
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
    </van-sticky>

    <div class="list-container">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="~ 到底啦 ~"
        @load="onLoad"
      >
        <AccountCard 
          v-for="item in accountList" 
          :key="item.id" 
          :item="item" 
          class="user-card"
        />
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AccountCard from '@/components/AccountCard.vue'; 

const searchKeyword = ref('');
const gameFilter = ref(0);
const sortFilter = ref('default');

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
      { id: Math.random(), title: '【秒发】V10全英雄全皮肤/绝版武则天', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '安卓QQ区', tags: ['包赔', '极品号'], price: '5.8', isBao: true },
      { id: Math.random(), title: '和平精英 玛莎拉蒂/火箭少女101退游甩', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '苹果微信', tags: ['可排位'], price: '4.0', isBao: false }
    ];
    accountList.value.push(...mockData);
    loading.value = false;
    if (accountList.value.length >= 10) finished.value = true;
  }, 1000);
};
</script>

<style scoped>
/* 🚀 核心 1：统一的紫白渐变背景，死死钉住！ */
.lobby-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  padding-bottom: 50px; 
}

/* 🚀 核心 2：顶部筛选区改为深色电竞风 */
.header-wrap {
  background: #171c26;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  padding-bottom: 5px;
}

/* 🚀 核心 3：复用首页的半透明玻璃搜索框 */
.lobby-search { background: transparent !important; padding: 10px 15px 5px 15px; }
:deep(.lobby-search .van-search__content) { background: rgba(0, 0, 0, 0.25) !important; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s; }
:deep(.lobby-search .van-search__content:focus-within) { border-color: #00e5ff; box-shadow: 0 0 8px rgba(0, 229, 255, 0.4); }
:deep(.lobby-search .van-field__control) { color: #fff; }
:deep(.lobby-search .van-field__control::placeholder) { color: rgba(255, 255, 255, 0.6); }

/* 🚀 核心 4：深度魔改 Vant 下拉菜单为暗黑霓虹风 */
:deep(.van-dropdown-menu__bar) { background: transparent; box-shadow: none; height: 40px; }
:deep(.van-dropdown-menu__title) { color: rgba(255, 255, 255, 0.9); font-size: 14px; }
:deep(.van-dropdown-menu__title::after) { border-color: transparent transparent rgba(255, 255, 255, 0.7) rgba(255, 255, 255, 0.7); }
:deep(.van-dropdown-item__content) { background: #171c26; } /* 下拉框深色底 */
:deep(.van-cell) { background: transparent; color: rgba(255, 255, 255, 0.8); } /* 列表项文字 */
:deep(.van-cell::after) { border-bottom: 1px solid rgba(255,255,255,0.05); } /* 极暗的分割线 */
:deep(.van-dropdown-item__option--active) { color: #00e5ff; background: rgba(0, 229, 255, 0.05); } /* 选中项荧光蓝 */
:deep(.van-dropdown-item__option--active .van-dropdown-item__icon) { color: #00e5ff; }

.list-container { padding: 12px; }
</style>