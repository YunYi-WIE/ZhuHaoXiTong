<template>
  <div class="mine-page">
    <div class="user-header">
      <div class="header-top">
        <div class="avatar-wrap">
          <van-image round width="64" height="64" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
        </div>
        <div class="user-info" @click="goToLogin">
          <div class="nickname">点击登录/注册 <van-icon name="arrow" size="14" /></div>
          <div class="user-id">租号玩，就上哈基龙</div>
        </div>
      </div>
      
      <div class="assets-row">
        <div class="asset-item">
          <div class="value">0.00</div>
          <div class="label">余额(元)</div>
        </div>
        <div class="asset-item">
          <div class="value">0.00</div>
          <div class="label">冻结(元)</div>
        </div>
        <div class="asset-item">
          <div class="value">0</div>
          <div class="label">积分</div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <van-cell title="我的订单" is-link value="全部订单" to="/order" :border="false" title-class="card-title" />
      <van-grid :border="false" :column-num="4">
        <van-grid-item icon="pending-payment" text="待付款" icon-color="#ff9500" />
        <van-grid-item icon="clock-o" text="租赁中" icon-color="#07c160" />
        <van-grid-item icon="warn-o" text="维权中" icon-color="#ff3b30" />
        <van-grid-item icon="passed" text="已完成" icon-color="#8a8a8f" />
      </van-grid>
    </div>

    <div class="section-card">
      <van-cell title="常用功能" :border="false" title-class="card-title" />
      <van-grid :border="false" :column-num="4">
        <van-grid-item icon="balance-list-o" text="资金明细" icon-color="#ffcc00" />
        <van-grid-item icon="shield-o" text="租客维权" icon-color="#34c759" />
        <van-grid-item icon="star-o" text="收藏账号" to="/favorites" icon-color="#ff9500" />
        <van-grid-item icon="question-o" text="帮助中心" icon-color="#5ac8fa" />
        <van-grid-item icon="service-o" text="联系客服" icon-color="#007aff" />
        <van-grid-item icon="setting-o" text="设置" to="/settings" icon-color="#5856d6" />
      </van-grid>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goToLogin = () => router.push('/login');
</script>

<style scoped>
.mine-page { background: #f4f6f9; min-height: 100vh; padding-bottom: 20px; }

/* 电竞风蓝紫渐变头部，增加发光效果 */
.user-header {
  background: linear-gradient(135deg, #4b126a 0%, #1bcedf 100%);
  padding: 50px 20px 30px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 4px 15px rgba(27, 206, 223, 0.3);
  position: relative;
}
/* 添加一个炫酷的背景光晕装饰 */
.user-header::after {
  content: ''; position: absolute; top: -20px; right: -20px;
  width: 150px; height: 150px; background: rgba(255,255,255,0.1);
  border-radius: 50%; filter: blur(30px); pointer-events: none;
}

.header-top { display: flex; align-items: center; position: relative; z-index: 2; }
.avatar-wrap { border: 2px solid rgba(255,255,255,0.4); border-radius: 50%; padding: 2px; }
.user-info { margin-left: 15px; color: #fff; }
.nickname { font-size: 20px; font-weight: bold; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
.user-id { font-size: 13px; color: rgba(255,255,255,0.8); background: rgba(0,0,0,0.2); padding: 2px 8px; border-radius: 10px; display: inline-block; }

.assets-row { display: flex; justify-content: space-around; margin-top: 30px; position: relative; z-index: 2; }
.asset-item { text-align: center; color: #fff; }
.asset-item .value { font-size: 18px; font-weight: bold; font-family: DINAlternate-Bold, sans-serif; margin-bottom: 4px; }
.asset-item .label { font-size: 12px; color: rgba(255,255,255,0.7); }

.section-card { background: #fff; border-radius: 16px; margin: 15px 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
/* 标题加粗加深 */
:deep(.card-title) { font-weight: bold; font-size: 16px; color: #2c3e50; }
</style>