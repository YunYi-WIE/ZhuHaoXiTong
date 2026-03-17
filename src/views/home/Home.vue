<template>
  <div class="home-page">
    <NavBar activeMenu="home" />

    <main class="home-content">
      <div class="banner-section">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item>
            <div class="banner-card promo-bg">
              <div class="promo-content">
                <h3 class="neon-text-blue">更多福利活动</h3>
                <p>请关注微信公众号：辰辉电竞</p>
                <div class="search-bar-mock">关注后即可领取优惠券</div>
              </div>
              <img src="@/assets/logo.png" class="banner-avatar" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="grid-nav-section">
        <div class="grid-item" v-for="(nav, index) in navList" :key="index" @click="handleNav(nav.path)">
          <div class="icon-box" :style="{ background: nav.color }">
            <van-icon :name="nav.icon" />
          </div>
          <span>{{ nav.name }}</span>
        </div>
      </div>

      <div class="account-list-section">
        <div class="filter-action-bar">
          <van-tabs v-model:active="activeTab" class="custom-tabs" shrink>
            <van-tab title="资产号租赁" name="asset" />
            <van-tab title="人在秒上号" name="online" />
            <van-tab title="🔥 特价" name="sale" />
            <van-tab title="账号交易" name="trade" />
          </van-tabs>
          
          <van-button icon="filter-o" size="small" class="pc-filter-btn" @click="openFilter">
            高级筛选
          </van-button>
        </div>

        <div class="account-grid">
          <div class="account-card" v-for="item in mockAccounts" :key="item.id" @click="goToDetail(item.id)">
            <div class="card-cover">
              <img :src="item.cover" alt="封面" />
              <div class="asset-tag">{{ item.currency }} 暗区币</div>
            </div>
            
            <div class="card-info">
              <h4 class="title">{{ item.title }}</h4>
              <div class="specs-tags">
                <span>{{ item.rank }}</span>
                <span>{{ item.safe }}</span>
                <span>{{ item.method }}</span>
              </div>
              <div class="price-line">
                <span class="price-tag">￥<b>{{ item.price }}</b>/小时</span>
                <van-button size="mini" type="primary" round>立即租号</van-button>
              </div>
            </div>
          </div>

          <div v-if="mockAccounts.length === 0" class="empty-wrap">
            <van-empty description="暂无相关账号数据" />
          </div>
        </div>
      </div>
    </main>

    <FilterPanel ref="filterRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import FilterPanel from './FilterPanel.vue';

const router = useRouter();
const filterRef = ref(null);
const activeTab = ref('asset');

const openFilter = () => {
  if (filterRef.value) {
    filterRef.value.show = true;
  }
};

// 金刚区导航数据
const navList = [
  { name: '代肝', icon: 'fire-o', color: '#00d26a', path: '/lobby' },
  { name: '3x3代肝', icon: 'gem-o', color: '#ff4d4f', path: '/lobby' },
  { name: '最新活动', icon: 'hot-o', color: '#ff7a45', path: '/publish' },
  { name: '资讯中心', icon: 'notes-o', color: '#1890ff', path: '/message' },
  { name: '在线客服', icon: 'chat-o', color: '#722ed1', path: 'kefu' },
];

// 模拟的账号列表数据（确保页面有内容展示）
const mockAccounts = ref([
  { 
    id: 1, 
    title: '【顶级资产】200M暗区币+全套金皮+3x3安全箱 极品账号', 
    currency: '201M', 
    rank: '传说段位', 
    safe: '3x3保险箱', 
    method: '扫码上号', 
    price: 8.5, 
    cover: 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281' 
  },
  { 
    id: 2, 
    title: '暗区币100M AWM多多 极品号 低价出租 速度上号', 
    currency: '105M', 
    rank: '王牌段位', 
    safe: '2x3保险箱', 
    method: '账号密码', 
    price: 5.0, 
    cover: 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281' 
  },
  { 
    id: 3, 
    title: '满配红皮 负重7级 极速上号 资产丰富 稳定不掉', 
    currency: '80M', 
    rank: '大师段位', 
    safe: '2x2保险箱', 
    method: '扫码上号', 
    price: 3.8, 
    cover: 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281' 
  },
  { 
    id: 4, 
    title: '特价纯金号 / 500M物资 / 随时可玩', 
    currency: '520M', 
    rank: '王牌段位', 
    safe: '3x3保险箱', 
    method: '免码直连', 
    price: 12.0, 
    cover: 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281' 
  }
]);

const handleNav = (path) => {
  if (path === 'kefu') return; // 在线客服暂不跳转
  router.push(path);
};

const goToDetail = (id) => {
  router.push(`/detail/${id}`);
};
</script>

<style scoped>
/* 全局基础样式 */
.home-page { 
  min-height: 100vh; 
  background-color: #ffffff; 
}
.home-content { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 15px; 
}

/* 1. 宣传栏样式 */
.banner-section { 
  margin-bottom: 25px; 
  border-radius: 12px; 
  overflow: hidden; 
}
.banner-card { 
  height: 160px; 
  background: linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%); 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 0 30px; 
}
.promo-content h3 { 
  color: #333; 
  margin-bottom: 5px; 
  font-size: 20px; 
  font-weight: 900;
}
.promo-content p {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}
.search-bar-mock {
  background: rgba(0,0,0,0.05);
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 12px;
  color: #555;
  display: inline-block;
}
.banner-avatar { 
  width: 80px; 
  height: 80px; 
  border-radius: 15px; 
}

/* 2. 金刚区样式 */
.grid-nav-section { 
  display: grid; 
  grid-template-columns: repeat(5, 1fr); 
  gap: 10px; 
  margin-bottom: 30px; 
  text-align: center; 
}
.grid-item { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer; 
}
.icon-box { 
  width: 48px; 
  height: 48px; 
  border-radius: 16px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: #fff; 
  font-size: 24px; 
}
.grid-item span { 
  font-size: 12px; 
  color: #333; 
  font-weight: 500; 
}

/* 3. 筛选条样式 */
.filter-action-bar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 0 5px; 
  margin-bottom: 20px; 
}
:deep(.custom-tabs .van-tabs__nav) {
  background: transparent;
}
:deep(.custom-tabs .van-tab--active) {
  font-weight: bold;
  color: #1989fa;
}
.pc-filter-btn { 
  border-radius: 8px; 
  background: #f7f8fa; 
  border: none; 
  color: #666; 
  width: 100px; 
}

/* 4. 账号卡片样式 */
.account-grid { 
  display: grid; 
  grid-template-columns: repeat(1, 1fr); 
  gap: 15px; 
}
.account-card { 
  background: #fff; 
  border-radius: 16px; 
  overflow: hidden; 
  border: 1px solid #f0f0f0; 
  transition: 0.3s; 
  cursor: pointer; 
}
.account-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transform: translateY(-3px);
}
.card-cover { 
  position: relative; 
  height: 150px; 
  background: #eee;
}
.card-cover img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}
.asset-tag { 
  position: absolute; 
  bottom: 8px; 
  left: 8px; 
  background: rgba(0,0,0,0.7); 
  color: #ffcc00; 
  font-size: 11px; 
  padding: 4px 8px; 
  border-radius: 6px; 
  font-weight: bold; 
}
.card-info { 
  padding: 15px; 
}
.title { 
  font-size: 14px; 
  color: #333; 
  margin-bottom: 10px; 
  line-height: 1.4; 
  height: 40px; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
  font-weight: bold;
}
.specs-tags { 
  display: flex; 
  gap: 6px; 
  margin-bottom: 15px; 
  flex-wrap: wrap;
}
.specs-tags span { 
  font-size: 11px; 
  background: #f0f7ff; 
  color: #1989fa; 
  padding: 3px 8px; 
  border-radius: 4px; 
}
.price-line { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}
.price-tag { 
  color: #ff4d4f; 
  font-size: 12px; 
}
.price-tag b { 
  font-size: 18px; 
  font-weight: 900;
}
.empty-wrap { 
  grid-column: 1 / -1; 
  padding: 50px 0; 
}

/* 🚀 PC端响应式优化 */
@media (min-width: 768px) {
  .home-content { 
    padding: 30px 40px; 
  }
  .banner-card { 
    height: 260px; 
  }
  .grid-nav-section {
    gap: 40px;
  }
  .icon-box {
    width: 64px;
    height: 64px;
    font-size: 32px;
  }
  .account-grid { 
    grid-template-columns: repeat(3, 1fr); /* 🚀 PC端一行显示 3 个 */
    gap: 25px; 
  }
}
</style>