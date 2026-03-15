<template>
  <div class="mine-page">
    <div class="user-card-wrap">
      <div class="user-info">
        <div class="avatar-box">
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="avatar" />
        </div>
        <div class="text-info">
          <h2 class="nickname">电竞高玩_888</h2>
          <p class="uid">ID: 88866622</p>
        </div>
      </div>
      <van-icon name="setting-o" class="setting-icon" size="24" @click="goTo('/setting')" />
    </div>

    <div class="panel-box order-panel">
      <div class="panel-header" @click="goTo('/order')">
        <h3>我的订单</h3>
        <span class="view-all">全部订单 <van-icon name="arrow" /></span>
      </div>
      <van-grid :column-num="4" :border="false" class="esports-grid">
        <van-grid-item text="待支付" @click="goToOrder(1)">
          <template #icon><van-icon name="pending-payment" class="neon-icon yellow" /></template>
        </van-grid-item>
        <van-grid-item text="租赁中" @click="goToOrder(2)">
          <template #icon><van-icon name="play-circle-o" class="neon-icon blue" /></template>
        </van-grid-item>
        <van-grid-item text="已完成" @click="goToOrder(3)">
          <template #icon><van-icon name="passed" class="neon-icon green" /></template>
        </van-grid-item>
        <van-grid-item text="售后/退款" @click="goTo('/after-sales')">
          <template #icon><van-icon name="service-o" class="neon-icon purple" /></template>
        </van-grid-item>
      </van-grid>
    </div>

    <div class="panel-box menu-panel">
      <van-cell-group :border="false" class="custom-cell-group">
        <van-cell title="资金明细" is-link icon="gold-coin-o" class="custom-cell" @click="handleDevelop" />
        <van-cell title="实名认证" is-link icon="idcard" class="custom-cell" @click="handleDevelop" />
        <van-cell title="帮助中心" is-link icon="question-o" class="custom-cell" @click="showHelp" />
        <van-cell title="联系客服" is-link icon="chat-o" class="custom-cell" @click="showContact" />
      </van-cell-group>
    </div>
    
    <div class="logout-wrap">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showDialog, showConfirmDialog, showToast, showImagePreview } from 'vant';

const router = useRouter();

const goTo = (path) => {
  router.push(path);
};

const goToOrder = (status) => {
  router.push({
    path: '/order',
    query: { active: status }
  });
};

// 1. 处理开发中模块
const handleDevelop = () => {
  showToast('该模块正在全力开发中...');
};

// 2. 仿PC端帮助中心弹窗
const showHelp = () => {
  showDialog({
    title: '帮助中心',
    message: 'Q: 租号后如何上号？\nA: 支付成功后在订单详情页获取“上号凭证”，下载对应游戏的官方上号器即可。\n\nQ: 账号无法登录怎么办？\nA: 请点击订单页的“申请售后”，我们会第一时间介入处理。',
    messageAlign: 'left',
    theme: 'round-button',
    confirmButtonColor: '#1900ff'
  });
};

// 3. 仿PC端联系客服 (展示二维码)
const showContact = () => {
  showConfirmDialog({
    title: '联系官方客服',
    message: '为了保障您的权益，请务必认准官方客服。\n工作时间：09:00 - 24:00',
    confirmButtonText: '查看二维码',
    cancelButtonText: '以后再说',
    confirmButtonColor: '#1900ff'
  }).then(() => {
    // 模拟展示客服二维码
    showImagePreview({
      images: ['https://fastly.jsdelivr.net/npm/@vant/assets/qrcode.png'],
      closeable: true,
    });
  });
};

// 4. 退出登录交互
const handleLogout = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要退出当前账号吗？',
    confirmButtonColor: '#ff3b30'
  }).then(() => {
    // 这里执行清除 token 等逻辑
    showToast('退出成功');
    // router.push('/login');
  }).catch(() => {});
};
</script>

<style scoped>
/* 保持你原本的所有 CSS 不动 */
.mine-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  padding: 20px 15px 70px 15px;
  color: #fff;
}

.panel-box {
  background: #171c26;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
}

.user-card-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
}
.user-info { display: flex; align-items: center; gap: 15px; }
.avatar-box {
  width: 60px; height: 60px; border-radius: 50%; padding: 3px;
  background: linear-gradient(135deg, #00e5ff, #6f42c1);
}
.avatar { width: 100%; height: 100%; border-radius: 50%; border: 2px solid #171c26; object-fit: cover; }
.nickname { font-size: 18px; margin: 0 0 5px 0; font-weight: bold; text-shadow: 0 0 5px rgba(255,255,255,0.3); }
.uid { font-size: 12px; color: rgba(255,255,255,0.6); margin: 0; }
.setting-icon { color: rgba(255,255,255,0.8); }

.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
.panel-header h3 { margin: 0; font-size: 15px; color: #fff; }
.view-all { font-size: 12px; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 2px; }

:deep(.esports-grid .van-grid-item__content) { background: transparent; padding: 10px 0; }
:deep(.van-grid-item__text) { color: rgba(255,255,255,0.7); margin-top: 8px; font-size: 12px; }
.neon-icon { font-size: 26px; }
.yellow { color: #ff9500; text-shadow: 0 0 8px rgba(255, 149, 0, 0.6); }
.blue { color: #00e5ff; text-shadow: 0 0 8px rgba(0, 229, 255, 0.6); }
.green { color: #07c160; text-shadow: 0 0 8px rgba(7, 193, 96, 0.6); }
.purple { color: #6f42c1; text-shadow: 0 0 8px rgba(111, 66, 193, 0.6); }

.menu-panel { padding: 5px 0; }
:deep(.custom-cell-group) { background: transparent; }
:deep(.custom-cell) { background: transparent; color: rgba(255,255,255,0.9); padding: 15px; align-items: center; }
:deep(.custom-cell::after) { border-bottom: 1px solid rgba(255,255,255,0.05); left: 15px; right: 15px; }
:deep(.custom-cell .van-cell__left-icon) { font-size: 20px; margin-right: 10px; color: #00e5ff; }
:deep(.custom-cell .van-cell__right-icon) { color: rgba(255,255,255,0.3); }

.logout-wrap { margin-top: 30px; text-align: center; }
.logout-btn {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.5);
  color: #ff3b30;
  width: 80%; padding: 12px 0; border-radius: 25px;
  font-size: 15px; font-weight: bold;
}
</style>