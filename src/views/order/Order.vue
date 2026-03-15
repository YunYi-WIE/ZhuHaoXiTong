<template>
  <div class="order-page">
    <van-nav-bar title="我的订单" :border="false" class="custom-nav" />

    <van-tabs
      v-model:active="activeTab"
      sticky
      class="custom-tabs"
      background="transparent"
      color="#fff"
    >
      <van-tab title="全部"></van-tab> 
      <van-tab title="待支付"></van-tab>
      <van-tab title="租赁中"></van-tab> 
      <van-tab title="已完成"></van-tab>
    </van-tabs>

    <div class="order-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="~ 没有更多订单啦 ~"
        @load="onLoad"
      >
        <div
          v-for="order in orderList"
          :key="order.id"
          class="order-card white-card"
        >
          <div class="card-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span :class="['order-status', order.statusClass]">{{
              order.statusText
            }}</span>
          </div>

          <div class="card-body">
            <img :src="order.cover" class="goods-img" />
            <div class="goods-info">
              <h4 class="goods-title">{{ order.title }}</h4>
              <p class="goods-sku">
                区服：{{ order.server }} | 时长：{{ order.hours }}小时
              </p>
              <div class="goods-price">
                ￥<b>{{ order.price }}</b>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button v-if="order.status === 'pending'" class="btn-outline-red" @click="goToPay(order)">
              立即支付
            </button>
            <button v-if="order.status === 'playing'" class="btn-outline-green" @click="handleGetAccount(order)">
              获取上号码
            </button>
            <button v-if="order.status === 'finished'" class="btn-default">
              再租一次
            </button>
            <button class="btn-default">联系客服</button>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 🚀 所有的路由工具合并到这一行
import { showToast, showDialog } from 'vant'; // 引入 vant 组件

const loading = ref(false);
const finished = ref(false);
const orderList = ref([]);
const route = useRoute();
const router = useRouter(); // 🚀 核心修复：定义 router 实例
const activeTab = ref(0); // 默认是 0 (全部)

// 🚀 核心逻辑：页面加载时检查 URL 参数
onMounted(() => {
  if (route.query.active !== undefined) {
    // ❌ 原来：activeTab.ref = Number(route.query.active);
    // ✅ 修复：使用 .value 赋值
    activeTab.value = Number(route.query.active);
  }
});

const goToPay = (order) => {
  // 🚀 跳转到支付页，实际项目中这里通常会传订单 ID
  router.push({
    path: '/pay',
    query: { orderId: order.id } 
  });
};

// 模拟加载订单数据
const onLoad = () => {
  setTimeout(() => {
    const mockOrders = [
      {
        id: 1,
        orderNo: 'SN202603148881',
        status: 'pending',
        statusText: '待支付',
        statusClass: 'text-red',
        title: '【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '安卓QQ区',
        hours: 4,
        price: '23.20',
      },
      {
        id: 2,
        orderNo: 'SN202603148882',
        status: 'playing',
        statusText: '租赁中',
        statusClass: 'text-green',
        title: '和平精英 玛莎拉蒂/火箭少女101/多粉装退游甩租',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '苹果微信',
        hours: 10,
        price: '40.00',
      },
      {
        id: 3,
        orderNo: 'SN202603135555',
        status: 'finished',
        statusText: '已完成',
        statusClass: 'text-gray',
        title: '原神 满命夜兰/雷神/胡桃 极品深渊号',
        cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        server: '天空岛',
        hours: 2,
        price: '12.00',
      },
    ];

    orderList.value.push(...mockOrders);
    loading.value = false;
    finished.value = true;
  }, 800);
};

// 模拟获取上号码的逻辑
const handleGetAccount = (order) => {
  import('vant').then(({ showDialog }) => {
    showDialog({
      title: '上号凭证',
      message: `账号：haxiaolong_vip\n密码：hx666888\n\n请在游戏内使用扫码登录，严禁开挂！`,
      theme: 'round-button',
      confirmButtonText: '复制并去游戏',
      confirmButtonColor: '#07c160'
    }).then(() => {
      showToast('账号已复制到剪贴板');
    });
  });
};
</script>

<style scoped>
/* 🚀 保持全局渐变背景死死钉住 */
.order-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  padding-bottom: 70px;
}

/* 🚀 顶部标题栏彻底透明化 */
:deep(.custom-nav) {
  background: transparent !important;
}
:deep(.van-hairline--bottom:after) {
  border-bottom-width: 0 !important;
} /* 撕掉 Vant 自带的底边框 */
:deep(.custom-nav .van-nav-bar__title) {
  color: #fff;
  font-weight: bold;
  font-size: 17px;
  letter-spacing: 1px;
}

/* 🚀 优化 Tabs 字体清晰度 */

/* 1. 未选中时的字体：提高不透明度，让它更白一点 */
:deep(.custom-tabs .van-tab) {
  background: transparent;
  font-size: 15px; /* 稍微加大一点字号 */
  color: rgba(255, 255, 255, 0.8) !important; /* 提高白色的亮度 */
  /* 给文字加一层极淡的黑影，能在任何渐变色背景上强行清晰 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); 
}

/* 2. 选中时的字体：纯白 + 加粗 */
:deep(.custom-tabs .van-tab--active) {
  color: #ffffff !important;
  font-weight: 800 !important; /* 加粗到极致 */
  text-shadow: 0 0 8px rgba(25, 0, 255, 0.5); /* 增加一层淡紫色的外发光 */
}

/* 3. 底部白线优化 */
:deep(.custom-tabs .van-tabs__line) {
  background-color: #ffffff !important;
  height: 3px !important; /* 稍微加粗线条 */
  bottom: 22px;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8); /* 线条也带点微光 */
}

/* 4. 解决模糊的关键：强制开启硬件加速渲染 */
:deep(.van-tab__text) {
  display: block;
  -webkit-font-smoothing: antialiased; /* 抗锯齿 */
  transform: translateZ(0); /* 强制开启 GPU 渲染，解决模糊问题 */
}

/* 列表容器 */
.order-list {
  padding: 12px;
}

/* 🚀 核心：订单卡片改为白底黑字，呼应首页 */
.white-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 极淡的阴影 */
  border: none;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 12px;
}
.order-no {
  color: #999;
}
.text-red {
  color: #ff3b30;
  font-weight: bold;
}
.text-green {
  color: #07c160;
  font-weight: bold;
}
.text-gray {
  color: #999;
}

/* 卡片内容区 */
.card-body {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}
.goods-img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #f5f5f5;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* 标题变黑字 */
.goods-title {
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-weight: bold;
}
.goods-sku {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
}
.goods-price {
  font-size: 12px;
  color: #ff3b30;
  text-align: right;
}
.goods-price b {
  font-size: 18px;
  font-family: DINAlternate-Bold, sans-serif;
}

/* 卡片底部操作区 */
.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
button {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

/* 默认灰色按钮 (白底适配) */
.btn-default {
  border: 1px solid #ddd;
  color: #666;
}
.btn-default:active {
  background: #f5f5f5;
}

/* 红色主按钮 (支付) */
.btn-outline-red {
  border: 1px solid #ff3b30;
  color: #ff3b30;
}
.btn-outline-red:active {
  background: #ff3b30;
  color: #fff;
}

/* 绿色主按钮 (上号) */
.btn-outline-green {
  border: 1px solid #07c160;
  color: #07c160;
}
.btn-outline-green:active {
  background: #07c160;
  color: #fff;
}

/* 隐藏到底部的提示文字 */
:deep(.van-list__finished-text) {
  color: rgba(255, 255, 255, 0.7);
}
</style>
