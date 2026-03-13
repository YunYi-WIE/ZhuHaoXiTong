<template>
  <div class="lobby-page">
    <van-sticky>
      <van-search v-model="searchKeyword" placeholder="搜索您想要的极品账号" />
      
      <van-dropdown-menu active-color="#ee0a24">
        <van-dropdown-item v-model="gameFilter" :options="gameOptions" />
        <van-dropdown-item v-model="sortFilter" :options="sortOptions" />
      </van-dropdown-menu>
    </van-sticky>

    <div class="list-container">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多账号了"
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
// 引入刚刚写好的组件
import AccountCard from '@/components/AccountCard.vue'; 
// 如果上面这行报错找不到路径，请改成： import AccountCard from '../../components/AccountCard.vue';

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
  // 模拟网络请求延迟
  setTimeout(() => {
    const mockData = [
      {
        id: Math.random(), // 随机ID
        title: '【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '安卓QQ区',
        tags: ['包赔', '排位不禁', '极品号'],
        price: '6.5'
      },
      {
        id: Math.random(),
        title: '和平精英 玛莎拉蒂/火箭少女101/多粉装退游甩租',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '苹果微信',
        tags: ['可排位', '高分段'],
        price: '4.0'
      }
    ];

    // 把新请求到的数据拼接到列表中
    accountList.value.push(...mockData);

    // 加载状态结束
    loading.value = false;

    // 假设数据加载了 10 条就表示没有更多数据了（模拟结束）
    if (accountList.value.length >= 10) {
      finished.value = true;
    }
  }, 1000); // 延迟1秒模拟加载效果
};
</script>

<style scoped>
.lobby-page {
  background: #f7f8fa;
  min-height: 100%;
}
.list-container {
  padding: 12px;
}
</style>