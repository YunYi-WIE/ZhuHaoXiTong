<template>
  <div class="pay-page">
    <van-nav-bar 
      title="订单支付" 
      left-arrow 
      @click-left="onClickLeft"
      class="custom-nav"
      :border="false"
    />

    <div class="timer-section">
      <p class="timer-label">支付剩余时间</p>
      <van-count-down :time="time" class="custom-timer" format="mm:ss" @finish="onTimerFinish" />
    </div>

    <div class="order-summary-card">
      <div class="price-box">
        <span class="symbol">￥</span>
        <span class="amount">23.20</span>
      </div>
      <div class="goods-detail">
        <p class="goods-name">【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏</p>
        <div class="detail-row">
          <span>租赁时长</span>
          <span class="val">4小时</span>
        </div>
        <div class="detail-row">
          <span>订单编号</span>
          <span class="val">SN202603148881</span>
        </div>
      </div>
    </div>

    <div class="pay-methods-panel">
      <h3 class="panel-title">选择支付方式</h3>
      <van-radio-group v-model="payMethod">
        <van-cell-group :border="false" class="method-group">
          <van-cell clickable @click="payMethod = 'alipay'" class="method-cell">
            <template #title>
              <div class="method-title">
                <van-icon name="alipay" class="icon-alipay" />
                <span>支付宝支付</span>
              </div>
            </template>
            <template #right-icon>
              <van-radio name="alipay" checked-color="#00e5ff" />
            </template>
          </van-cell>
          
          <van-cell clickable @click="payMethod = 'wechat'" class="method-cell">
            <template #title>
              <div class="method-title">
                <van-icon name="wechat" class="icon-wechat" />
                <span>微信支付</span>
              </div>
            </template>
            <template #right-icon>
              <van-radio name="wechat" checked-color="#07c160" />
            </template>
          </van-cell>

          <van-cell clickable @click="payMethod = 'balance'" class="method-cell">
            <template #title>
              <div class="method-title">
                <van-icon name="gold-coin" class="icon-balance" />
                <span>账户余额 <small>(可用: ￥100.00)</small></span>
              </div>
            </template>
            <template #right-icon>
              <van-radio name="balance" checked-color="#ff9500" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>

    <div class="pay-footer">
      <div class="security-tips">
        <van-icon name="shield-check" />
        <span>安全支付环境已开启，请放心操作</span>
      </div>
      <button class="confirm-pay-btn" @click="handleConfirmPay">
        确认支付 ￥23.20
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showDialog } from 'vant';

const router = useRouter();
const time = ref(15 * 60 * 1000); // 15分钟倒计时
const payMethod = ref('alipay');

const onClickLeft = () => {
  router.back();
};

const onTimerFinish = () => {
  showDialog({ message: '订单已超时，请重新下单' }).then(() => {
    router.back();
  });
};

const handleConfirmPay = () => {
  showToast({
    message: '支付跳转中...',
    type: 'loading',
    duration: 2000,
    onClose: () => {
      showToast({ message: '支付成功！', type: 'success' });
      router.push('/order?active=2'); // 支付成功跳到“租赁中”状态页
    }
  });
};
</script>

<style scoped>
/* 🚀 核心：全局紫蓝渐变背景 */
.pay-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  padding-bottom: 120px;
}

/* 顶部导航透明化 */
:deep(.custom-nav) { background: transparent !important; }
:deep(.custom-nav .van-nav-bar__title), 
:deep(.custom-nav .van-icon) { color: #fff !important; font-weight: bold; }

/* 倒计时样式 */
.timer-section { text-align: center; padding: 20px 0; }
.timer-label { font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 8px; }
.custom-timer { color: #fff; font-size: 32px; font-weight: bold; font-family: 'DIN Alternate'; text-shadow: 0 0 10px rgba(0,229,255,0.5); }

/* 🚀 订单卡片 (白底黑字) */
.order-summary-card {
  background: #fff;
  margin: 0 15px 15px 15px;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.price-box { color: #ff3b30; margin-bottom: 15px; }
.price-box .symbol { font-size: 20px; font-weight: bold; }
.price-box .amount { font-size: 36px; font-weight: bold; font-family: 'DIN Alternate'; }

.goods-detail { border-top: 1px dashed #eee; padding-top: 15px; text-align: left; }
.goods-name { font-size: 14px; color: #333; font-weight: bold; margin-bottom: 10px; line-height: 1.4; }
.detail-row { display: flex; justify-content: space-between; font-size: 13px; color: #999; margin-bottom: 6px; }
.detail-row .val { color: #666; }

/* 🚀 支付方式面板 (深色电竞材质) */
.pay-methods-panel {
  background: #171c26;
  margin: 0 15px;
  border-radius: 16px;
  padding: 15px 0;
  border: 1px solid rgba(255,255,255,0.05);
}
.panel-title { color: #fff; font-size: 15px; padding: 0 20px 10px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }

.method-group { background: transparent; }
.method-cell { background: transparent !important; color: #fff !important; padding: 15px 20px; }
.method-cell::after { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }

.method-title { display: flex; align-items: center; gap: 12px; font-size: 15px; }
.method-title small { font-size: 11px; color: rgba(255,255,255,0.4); }

.icon-alipay { color: #1677ff; font-size: 24px; }
.icon-wechat { color: #07c160; font-size: 24px; }
.icon-balance { color: #ff9500; font-size: 24px; }

/* 🚀 底部支付按钮 */
.pay-footer {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #fff; padding: 15px 15px calc(15px + env(safe-area-inset-bottom));
  box-shadow: 0 -5px 15px rgba(0,0,0,0.05);
  text-align: center;
}
.security-tips { font-size: 11px; color: #07c160; display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 12px; }

.confirm-pay-btn {
  width: 100%; height: 48px;
  background: linear-gradient(90deg, #1900ff, #2575fc);
  border: none; border-radius: 24px;
  color: #fff; font-size: 16px; font-weight: bold;
  box-shadow: 0 4px 15px rgba(25, 0, 255, 0.3);
}
.confirm-pay-btn:active { transform: scale(0.98); }
</style>