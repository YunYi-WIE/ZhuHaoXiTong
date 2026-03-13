<template>
  <div class="home-page">
    <van-sticky>
      <div class="brand-header">
          <img :src="logoImg" class="brand-logo" />
          <span class="brand-name">哈小龙小店</span>
        </div>
      <div class="search-wrap">
        <van-search v-model="searchKeyword" placeholder="搜索游戏/区服/编号" shape="round" background="transparent" />
      </div>
    </van-sticky>

    <div class="banner-box">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#ff3b30">
        <van-swipe-item v-for="(img, index) in bannerList" :key="index">
          <img :src="img" class="banner-img" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-notice-bar
      left-icon="volume"
      text="防骗提示：请勿脱离平台交易，任何索要验证码的行为都是诈骗！"
      color="#ff6034"
      background="linear-gradient(90deg, #fff5f0, #ffffff)"
      class="notice-bar"
    />

    <van-grid :column-num="5" :border="false" class="nav-grid">
      <van-grid-item v-for="(item, index) in gameNavs" :key="index" @click="goToLobby">
        <div class="icon-wrap">
          <van-image :src="item.icon" width="36" height="36" radius="50%" />
        </div>
        <span class="nav-text">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>

    <div class="hot-section">
      <div class="section-title">
        <h3 class="gradient-text">🔥 推荐好号</h3>
        <span class="more" @click="goToLobby">更多 <van-icon name="arrow" /></span>
      </div>
      
      <div class="account-list">
        <AccountCard v-for="item in hotAccounts" :key="item.id" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
// ... 这里的 script 代码和之前完全一样，保留您的热推账号和游戏数组数据即可 ...
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AccountCard from '@/components/AccountCard.vue'; 
import logoImg from '@/assets/logo.png';

const router = useRouter();
const searchKeyword = ref('');
const bannerList = ref(['https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg']);
const gameNavs = ref([
  { name: '王者荣耀', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
  { name: '和平精英', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
  { name: '绝地求生', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
  { name: '英雄联盟', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
  { name: '全部游戏', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
]);
const hotAccounts = ref([
  { id: 101, title: 'V10全英雄全皮肤/武则天/典藏皮肤多款可选', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '安卓QQ区', tags: ['排位不禁', '极品连体'], price: '5.8', isBao: true },
  { id: 102, title: '高分段玛莎拉蒂/多粉装退游甩租', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg', server: '苹果微信', tags: ['可排位', '载具多'], price: '3.5', isBao: false }
]);
const goToLobby = () => router.push('/lobby');
</script>

<style scoped>
.home-page { background: #f4f6f9; min-height: 100vh; }

/* 头部整体容器渐变背景 */
.header-container {
  background: linear-gradient(180deg, #e8f0fe 0%, #f4f6f9 100%);
  padding-top: 10px; /* 距离顶部留出一点空间，如果是 APP 还需要留出状态栏高度 */
}

/* 品牌栏样式 */
.brand-header {
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
}
.brand-logo {
  height: 32px; /* 限制一下最高高度，配合导航栏 */
  width: auto;  /* 宽度设为 auto，完美保持原图宽高比例 */
  border-radius: 4px; /* 稍微给一点点圆角，如果您希望完全是方角，可以把这行删掉 */
  /* 去掉了之前强制加的白边，让您的 Logo 原图自然展示 */
}
.brand-name {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  letter-spacing: 1px; /* 字间距稍微拉开一点，更大气 */
}

/* 搜索框外部包装不再需要背景色，因为外层 container 已经有了 */
.search-wrap { padding-top: 4px; }
.banner-box { padding: 10px; background: #f4f6f9; }
.my-swipe .banner-img { width: 100%; height: 140px; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.notice-bar { margin: 0 10px 10px; border-radius: 8px; font-weight: bold; }

.nav-grid { background: transparent; padding: 0 10px 10px; }
.icon-wrap { background: #fff; padding: 6px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.nav-text { font-size: 12px; color: #333; margin-top: 6px; font-weight: 500; }

.hot-section { padding: 0 12px; }
.section-title { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
.gradient-text {
  margin: 0; font-size: 18px; font-weight: bold;
  background: linear-gradient(135deg, #ff3b30, #ff9500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-title .more { font-size: 12px; color: #888; background: #eef1f5; padding: 4px 8px; border-radius: 12px; }
</style>