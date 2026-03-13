<template>
  <div class="home-page">
    <van-sticky>
      <van-search 
        v-model="searchKeyword" 
        placeholder="搜索游戏、大区或编号" 
        shape="round"
        background="#ffffff"
      />
    </van-sticky>

    <div class="banner-box">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(img, index) in bannerList" :key="index">
          <img :src="img" class="banner-img" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-grid :column-num="4" :border="false" class="nav-grid">
      <van-grid-item v-for="(item, index) in gameNavs" :key="index" @click="goToLobby(item.id)">
        <van-image :src="item.icon" width="45" height="45" radius="10" />
        <span class="nav-text">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>

    <div class="hot-section">
      <div class="section-title">
        <h3>🔥 热门极品号</h3>
        <span class="more" @click="goToLobby()">更多 ></span>
      </div>
      
      <div class="account-list">
        <AccountCard v-for="item in hotAccounts" :key="item.id" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AccountCard from '@/components/AccountCard.vue';

const router = useRouter();
const searchKeyword = ref('');

// 模拟轮播数据
const bannerList = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
]);

// 模拟游戏导航数据
const gameNavs = ref([
  { id: 1, name: '王者荣耀', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
  { id: 2, name: '和平精英', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
  { id: 3, name: '原神', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
  { id: 4, name: '英雄联盟', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
]);

// 模拟账号数据
const hotAccounts = ref([
  {
    id: 101,
    title: '【包赔】V10全英雄全皮肤/武则天/典藏皮肤多款可选极品号',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
    server: '安卓QQ区',
    tags: ['排位不禁', '极品连体', 'V10'],
    price: '5.8'
  },
  {
    id: 102,
    title: '【高改】和平精英玛莎拉蒂/多粉装/大吉大利',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
    server: '苹果微信',
    tags: ['可排位', '载具多'],
    price: '3.5'
  }
]);

const goToLobby = (id) => {
  router.push('/lobby');
};
</script>

<style scoped>
.home-page {
  background: #f7f8fa;
  min-height: 100%;
}
.banner-box {
  padding: 10px;
}
.my-swipe .banner-img {
  width: 100%;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
}
.nav-grid {
  margin-bottom: 12px;
  background: #fff;
}
.nav-text {
  font-size: 12px;
  color: #333;
  margin-top: 6px;
}

/* 推荐列表样式 */
.hot-section {
  padding: 0 12px;
}
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.section-title h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
.section-title .more {
  font-size: 12px;
  color: #999;
}
.price-box .price {
  color: #ee0a24;
  font-size: 12px;
}
.price-box .price b {
  font-size: 18px;
}
</style>