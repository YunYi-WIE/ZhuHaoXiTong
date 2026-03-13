<template>
  <div class="lobby-page">
    <van-sticky>
      <div class="header-wrap">
        <van-search 
          v-model="searchKeyword" 
          placeholder="搜索您想要的极品账号" 
          shape="round" 
          background="transparent" 
          class="lobby-search"
        />
        
        <van-dropdown-menu active-color="#ff3b30" class="custom-dropdown">
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
        />
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AccountCard from '@/components/AccountCard.vue'; 

// --- 筛选条件相关数据 ---
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

// --- 列表加载相关数据 ---
const accountList = ref([]);
const loading = ref(false);
const finished = ref(false);

// 模拟后端接口获取数据
const onLoad = () => {
  setTimeout(() => {
    const mockData = [
      {
        id: Math.random(),
        title: '【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '安卓QQ区',
        tags: ['包赔', '排位不禁', '极品号'],
        price: '6.5',
        isBao: true // 触发包赔小红标
      },
      {
        id: Math.random(),
        title: '和平精英 玛莎拉蒂/火箭少女101/多粉装退游甩租',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '苹果微信',
        tags: ['可排位', '高分段'],
        price: '4.0',
        isBao: false
      }
    ];

    accountList.value.push(...mockData);
    loading.value = false;

    if (accountList.value.length >= 10) {
      finished.value = true;
    }
  }, 1000);
};
</script>

<style scoped>
/* 1. 统一背景色，并预留底部导航栏的高度防遮挡 */
.lobby-page {
  background: #f4f6f9;
  min-height: 100vh;
  padding-bottom: 50px; 
}

/* 2. 顶部吸顶区域增加白色背景和极淡的阴影 */
.header-wrap {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

/* 3. 去除搜索框默认的奇怪内边距，使其更紧凑 */
.lobby-search {
  padding-bottom: 4px;
}

/* 4. 去除下拉菜单自带的丑陋底边框 */
:deep(.van-dropdown-menu__bar) {
  box-shadow: none;
  height: 40px;
}

/* 5. 列表容器内边距适配 */
.list-container {
  padding: 12px;
}
</style>