<template>
  <div class="order-page">
    
    <NavBar activeMenu="none" class="desktop-only" />

    <van-nav-bar 
      title="我的订单" 
      left-arrow 
      @click-left="router.back()"
      class="mobile-nav mobile-only transparent-nav"
      :border="false"
      placeholder
    />

    <main class="main-content">
      <div class="order-tabs-wrapper glass-card">
        <van-tabs 
          v-model:active="activeTab" 
          sticky 
          :offset-top="isDesktop ? 60 : 0"
          color="#1900ff" 
          animated
          @change="onTabChange"
        >
          <van-tab title="全部" :name="0"></van-tab>
          <van-tab title="待支付" :name="1"></van-tab>
          <van-tab title="租赁中" :name="2"></van-tab>
          <van-tab title="已完成" :name="3"></van-tab>
        </van-tabs>
      </div>

      <div class="order-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="~ 没有更多订单了 ~"
            @load="onLoad"
          >
            <div v-for="item in orderList" :key="item.id" class="order-card glass-card">
              <div class="order-header">
                <span class="order-sn">订单号：{{ item.sn }}</span>
                <span class="order-status" :class="'status-' + item.status">{{ getStatusText(item.status) }}</span>
              </div>
              
              <div class="order-body" @click="goToDetail(item.id)">
                <img :src="item.cover" class="order-img" />
                <div class="order-info">
                  <h4 class="title">{{ item.title }}</h4>
                  <p class="desc">租赁时长：{{ item.duration }}小时</p>
                  <p class="time">下单时间：{{ item.time }}</p>
                </div>
              </div>

              <div class="order-footer">
                <div class="total-price">实付：<span>￥{{ item.price }}</span></div>
                <div class="actions">
                  <van-button size="small" round v-if="item.status === 1" color="#ff3b30" @click="goToPay(item)">立即支付</van-button>
                  <van-button size="small" round v-if="item.status === 2" @click="showCode(item)">查看卡密</van-button>
                  <van-button size="small" round plain v-if="item.status === 3" @click="goToAfterSales(item)">申请售后</van-button>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const route = useRoute();

// 🚀 根据路由参数初始化 Tab 状态
const activeTab = ref(Number(route.query.active) || 0);
const orderList = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

// 判断是否为电脑端（用于动态调整 sticky 偏移量）
const isDesktop = computed(() => window.innerWidth >= 768);

const getStatusText = (status) => {
  const map = { 1: '待支付', 2: '租赁中', 3: '已完成' };
  return map[status] || '已取消';
};

const onLoad = () => {
  setTimeout(() => {
    if (refreshing.value) {
      orderList.value = [];
      refreshing.value = false;
    }

    const mockData = [
      { id: 1, sn: 'SN88481234', title: '【秒发】V10全英雄全皮肤/绝版武则天', price: '23.20', duration: 4, status: 2, time: '2023-10-26 14:20', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg' },
      { id: 2, sn: 'SN88481235', title: '和平精英 玛莎拉蒂/火箭少女101', price: '12.00', duration: 3, status: 1, time: '2023-10-26 15:30', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg' }
    ];
    
    orderList.value.push(...mockData);
    loading.value = false;
    if (orderList.value.length >= 10) finished.value = true;
  }, 1000);
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

const onTabChange = (name) => {
  onRefresh();
};

const goToDetail = (id) => router.push(`/detail/${id}`);
const goToPay = (item) => router.push('/pay');
const goToAfterSales = (item) => router.push('/after-sales');
const showCode = (item) => { /* 查看卡密逻辑 */ };
</script>

<style scoped>
/* =========================================
   全局基础设定 (紫蓝电竞风)
   ========================================= */
.order-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* 手机端透明返回栏 */
:deep(.transparent-nav) { background: transparent !important; }
:deep(.transparent-nav .van-nav-bar__title) { color: #fff !important; font-weight: bold; text-shadow: 0 2px 8px rgba(0,0,0,0.6); }

/* 玻璃卡片通用材质 */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* =========================================
   内容布局
   ========================================= */
.order-tabs-wrapper {
  margin-bottom: 15px;
  overflow: hidden;
}
:deep(.van-tabs__nav) { background: transparent; }

.order-card {
  padding: 15px;
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;
  font-size: 13px;
}
.order-sn { color: #999; }
.order-status { font-weight: bold; }
.status-1 { color: #ff3b30; }
.status-2 { color: #1900ff; }
.status-3 { color: #07c160; }

.order-body {
  display: flex;
  gap: 12px;
  padding: 15px 0;
  cursor: pointer;
}
.order-img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }
.order-info { flex: 1; }
.order-info .title { font-size: 14px; color: #333; margin: 0 0 8px 0; line-height: 1.4; font-weight: bold; }
.order-info p { margin: 4px 0; font-size: 12px; color: #999; }

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}
.total-price { font-size: 13px; color: #666; }
.total-price span { color: #ff3b30; font-size: 18px; font-weight: bold; font-family: 'DIN Alternate'; }

.actions { display: flex; gap: 8px; }

/* =========================================
   ✨ 核心：多端响应式与宽度限制
   ========================================= */

/* --- 📱 手机端适配 --- */
@media (max-width: 767px) {
  .desktop-only { display: none !important; }
  .main-content { padding: 10px 15px 70px 15px; }
}

/* --- 💻 电脑端适配 (>= 768px) --- */
@media (min-width: 768px) {
  .mobile-only { display: none !important; }
  
  /* 🚀 限制宽带：限制在 800px，订单列表不需要太宽，否则信息太散 */
  .main-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 80px 15px 50px 15px; 
  }

  .order-card {
    transition: transform 0.2s;
  }
  .order-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  }
}
</style>