<template>
  <div class="mine-page">
    <div class="user-header">
      <van-image 
        round 
        width="65" 
        height="65" 
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" 
        class="avatar"
      />
      <div class="user-info">
        <div class="nickname" @click="goToLogin">
          <span>哈基龙新用户</span> 
          <van-icon name="arrow" size="14" color="#fff" />
        </div>
        <div class="user-id">
          ID: 888888 
          <van-tag color="rgba(255,255,255,0.3)" text-color="#fff" size="mini" class="copy-btn">复制</van-tag>
        </div>
      </div>
    </div>

    <div class="assets-card">
      <div class="asset-item">
        <div class="value">0.00</div>
        <div class="label">账户余额(元)</div>
      </div>
      <div class="asset-item">
        <div class="value">0</div>
        <div class="label">优惠券(张)</div>
      </div>
      <div class="asset-item">
        <div class="value">0</div>
        <div class="label">我的积分</div>
      </div>
    </div>

    <div class="section-card">
      <van-cell title="我的订单" is-link value="全部订单" to="/order" :border="false" />
      <van-grid :border="false" class="order-grid">
        <van-grid-item icon="pending-payment" text="待付款" badge="1" />
        <van-grid-item icon="clock-o" text="租赁中" />
        <van-grid-item icon="passed" text="已完成" />
        <van-grid-item icon="after-sale" text="售后/维权" />
      </van-grid>
    </div>

    <div class="section-card">
      <van-cell-group :border="false">
        <van-cell title="资金流水" icon="gold-coin-o" is-link />
        <van-cell title="我的收藏" icon="star-o" is-link to="/favorites" />
        <van-cell title="联系客服" icon="service-o" is-link @click="contactService" />
        <van-cell title="设置" icon="setting-o" is-link to="/settings" />
      </van-cell-group>
    </div>

    <div class="logout-box">
      <van-button block round type="default" @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showConfirmDialog } from 'vant';
import { showToast } from 'vant';

const router = useRouter();

const contactService = () => {
  showToast('客服微信：kefu8888 \n工作时间：9:00-22:00');
};

// 跳转登录页（如果未登录）
const goToLogin = () => {
  router.push('/login');
};

// 退出登录逻辑
const handleLogout = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？',
  }).then(() => {
    console.log('用户点击了确认退出');
    // 清除 Token 逻辑以后写在这里
  }).catch(() => {
    // on cancel
  });
};
</script>

<style scoped>
.mine-page {
  background: #f7f8fa;
  min-height: 100%;
  padding-bottom: 20px;
}

/* 头部渐变背景 */
.user-header {
  height: 160px;
  background: linear-gradient(to right, #ff6034, #ee0a24);
  padding: 40px 20px 0;
  display: flex;
  align-items: flex-start;
}
.avatar {
  border: 2px solid rgba(255, 255, 255, 0.4);
  margin-right: 15px;
}
.user-info {
  color: #fff;
  margin-top: 8px;
}
.nickname {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}
.user-id {
  font-size: 12px;
  opacity: 0.9;
}
.copy-btn {
  margin-left: 6px;
  padding: 0 4px;
}

/* 资产卡片（悬浮在头部上方） */
.assets-card {
  background: #fff;
  border-radius: 12px;
  margin: -30px 12px 12px; /* 负边距实现向上悬浮效果 */
  padding: 16px 0;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  position: relative;
  z-index: 2;
}
.asset-item {
  text-align: center;
}
.asset-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}
.asset-item .label {
  font-size: 12px;
  color: #666;
}

/* 通用卡片区域 */
.section-card {
  background: #fff;
  border-radius: 12px;
  margin: 0 12px 12px;
  overflow: hidden;
}
.order-grid {
  padding-bottom: 10px;
}

/* 退出按钮 */
.logout-box {
  margin: 20px 12px;
}
</style>