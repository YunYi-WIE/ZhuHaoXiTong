<template>
  <div class="h5-home-page user-theme">
    <div class="fixed-logo-bar">
      <div class="logo-box">
        <img src="@/assets/logo.png" class="logo-img glow-effect" />
        <span class="brand-name neon-text">哈小龙小店</span>
      </div>
      <van-icon name="chat-o" size="22" class="cs-icon neon-cs" @click="goTo('/lobby')" />
    </div>

    <div class="scroll-content">
      
      <div class="search-wrap esports-search">
        <van-search 
          v-model="searchKeyword" 
          placeholder="搜索您想要的极品账号" 
          shape="round" 
          background="transparent" 
          class="custom-search"
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
        <h3 class="section-title neon-section-title">精选好号 <span class="subtitle">官方包赔 放心租</span></h3>
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="~ 到底啦 ~"
          @load="onLoad"
          class="account-list"
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AccountCard from '@/components/AccountCard.vue';

const router = useRouter();
const searchKeyword = ref('');

// 轮播图数据
const bannerList = ref([
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop'
]);

// 列表数据加载
const accountList = ref([]);
const loading = ref(false);
const finished = ref(false);

const onLoad = () => {
  setTimeout(() => {
    const mockData = [
      {
        id: Math.random(),
        title: '【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '安卓QQ区',
        tags: ['包赔', '排位不禁', '极品号'],
        price: '5.8',
        isBao: true
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

    // 模拟加载10条后到底
    if (accountList.value.length >= 10) {
      finished.value = true;
    }
  }, 1000);
};

const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
/* 🚀 整个页面背景 - 纯正的紫色到蓝色从上至下渐变 */
.h5-home-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed; /* 🚀 核心魔法：把背景死死钉在屏幕上，绝不随内容滚动！ */
  min-height: 100vh;
  padding-bottom: 50px; 
  color: #fff;
}

/* 🚀 固定的 Logo 顶栏 - 使用深色背景和霓虹效果 */
.fixed-logo-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #171c26;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.logo-box { display: flex; align-items: center; gap: 8px; }
.logo-img { width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); }
.glow-effect { box-shadow: 0 0 10px rgba(111, 66, 193, 0.5); }
.neon-text { font-size: 16px; font-weight: bold; color: #fff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 59, 48, 0.5); }
.cs-icon { color: #888; transition: color 0.3s; }
.cs-icon:hover { color: #07c160; }
.neon-cs { text-shadow: 0 0 5px #07c160; }

/* 🚀 滚动内容区 (防遮挡) */
.scroll-content {
  padding-top: 50px; 
}

/* 🚀 核心修复：让搜索栏外层彻底透明，完美融入渐变背景 */
.search-wrap { 
  background: transparent !important; /* 强制背景透明 */
  padding: 10px 0 0 0; /* 调整一下间距，看起来更舒服 */
  border: none !important; /* 撕掉任何可能的边框 */
}

/* 优化里面的“搜索胶囊”，用半透明黑色，玻璃质感拉满 */
:deep(.custom-search .van-search__content) { 
  background: rgba(0, 0, 0, 0.25) !important; /* 黑色半透明，透出一点点底色 */
  border: 1px solid rgba(255, 255, 255, 0.15); /* 极细的高光白边 */
  transition: all 0.3s; 
}

/* 搜索框激活时的发光效果 */
:deep(.custom-search .van-search__content:focus-within) { 
  border-color: #00e5ff; /* 荧光蓝边框 */
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4); 
}

/* 搜索框文字和占位符颜色 */
:deep(.custom-search .van-field__control) { color: #fff; }
:deep(.custom-search .van-field__control::placeholder) { color: rgba(255, 255, 255, 0.6); }

/* 轮播图底色 - 改为透明 */
.banner-wrap { padding: 12px; background: transparent; }
.banner-img { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; }
.active-shadow { box-shadow: 0 0 15px rgba(111, 66, 193, 0.6); }

/* 金刚区 - 深色和霓虹图标 */
.nav-grid { background: transparent; margin-bottom: 15px; padding: 15px 0 10px 0; }
:deep(.esports-grid .van-grid-item__content) { background: #171c26; border-radius: 10px; margin: 0 5px; padding: 15px 0; transition: transform 0.2s, background 0.2s; }
:deep(.esports-grid .van-grid-item__content:hover) { transform: translateY(-3px); background: #1c2331; }
:deep(.van-grid-item__text) { color: #bbb; margin-top: 8px; font-size: 12px; }
.grid-icon { font-size: 24px; }
.neon-fire { color: #ff3b30; text-shadow: 0 0 8px #ff3b30; }
.neon-aim { color: #07c160; text-shadow: 0 0 8px #07c160; }
.neon-gem { color: #6f42c1; text-shadow: 0 0 8px #6f42c1; }
.neon-gift { color: #ff9500; text-shadow: 0 0 8px #ff9500; }

/* 列表区 */
.list-section { padding: 0 12px; }
.section-title { font-size: 18px; color: #fff; margin: 20px 0 15px 0; display: flex; align-items: baseline; gap: 10px; }
.neon-section-title { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
.subtitle { font-size: 12px; color: #666; font-weight: normal; }
</style>