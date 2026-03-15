<template>
  <div class="mine-page">
    
    <NavBar activeMenu="mine" class="desktop-only" />

    <van-nav-bar 
      title="个人中心" 
      class="mobile-nav mobile-only transparent-nav"
      :border="false"
      placeholder
    />

    <main class="main-content">
      
      <div class="profile-section">
        <div class="profile-card dark-glass-card">
          <div class="user-info">
            <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="avatar" />
            <div class="info-text">
              <h2 class="username">电竞高玩_888 <span class="vip-tag">SVIP</span></h2>
              <p class="user-id">ID: 884812345</p>
            </div>
          </div>
          
          <div class="asset-panel">
            <div class="asset-item">
              <div class="num">3</div>
              <div class="label">优惠券 (张)</div>
            </div>
            <div class="asset-item">
              <div class="num">2560</div>
              <div class="label">当前积分</div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        
        <div class="dashboard-card dark-glass-card">
          <div class="card-header">
            <h3 class="white-text">我的订单</h3>
            <span class="view-all" @click="goToOrder(0)">全部订单 <van-icon name="arrow" /></span>
          </div>
          <van-grid :border="false" :column-num="4" class="custom-grid">
            <van-grid-item icon="pending-payment" text="待付款" @click="goToOrder(1)" />
            <van-grid-item icon="play-circle-o" text="租赁中" @click="goToOrder(2)" />
            <van-grid-item icon="passed" text="已完成" @click="goToOrder(3)" />
            <van-grid-item icon="service-o" text="售后/退款" @click="goTo('/after-sales')" />
          </van-grid>
        </div>

        <div class="dashboard-card dark-glass-card">
          <div class="card-header">
            <h3 class="white-text">常用服务</h3>
          </div>
          <van-cell-group inset class="custom-cell-group">
            <van-cell title="实名认证" icon="idcard" is-link @click="showRealNameAuth" />
            <van-cell title="联系客服" icon="chat-o" is-link @click="showHelp = true" />
            <van-cell title="系统设置" icon="setting-o" is-link @click="goTo('/setting')" />
          </van-cell-group>
        </div>

        <div class="logout-wrap">
          <van-button block round class="logout-btn" @click="handleLogout">退出登录</van-button>
        </div>

      </div>
    </main>

    <van-dialog v-model:show="showHelp" title="专属客服" show-cancel-button>
      <div style="text-align: center; padding: 20px;">
        <img src="https://fastly.jsdelivr.net/npm/@vant/assets/qrcode.png" style="width: 150px;" />
        <p style="margin-top: 10px; color: #666;">扫码添加官方客服</p>
      </div>
    </van-dialog>

    <van-dialog v-model:show="realNameVisible" title="实名认证" show-cancel-button @confirm="handleAuthConfirm">
      <div class="auth-form">
        <van-field v-model="authForm.name" label="姓名" placeholder="请输入真实姓名" />
        <van-field v-model="authForm.idCard" label="身份证" placeholder="请输入身份证号" />
        <p class="auth-tips">根据国家相关规定，租号需进行实名认证</p>
      </div>
    </van-dialog>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const showHelp = ref(false);
const realNameVisible = ref(false); // 弹窗状态变量

const authForm = reactive({
  name: '',
  idCard: ''
});

const goTo = (path) => router.push(path);

// 跳转订单
const goToOrder = (status) => {
  router.push({ path: '/order', query: { active: status } });
};

// 🚀 修复后的实名认证唤起函数
const showRealNameAuth = () => {
  realNameVisible.value = true; // 使用 .value 才能生效
};

// 提交认证逻辑
const handleAuthConfirm = () => {
  if (!authForm.name || !authForm.idCard) {
    showToast('请填写完整信息');
    return;
  }
  showToast('认证申请已提交');
  // 提交后重置表单
  authForm.name = '';
  authForm.idCard = '';
};

// 退出登录
const handleLogout = () => {
  showConfirmDialog({
    title: '温馨提示',
    message: '确认要退出当前账号吗？',
    confirmButtonColor: '#ff3b30'
  }).then(() => {
    showToast('已退出登录');
    router.replace('/login');
  }).catch(() => {});
};
</script>

<style scoped>
/* =========================================
   全局基础设定
   ========================================= */
.mine-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* 手机端透明返回栏 */
:deep(.transparent-nav) { background: transparent !important; }
:deep(.transparent-nav .van-nav-bar__title) { color: #fff !important; font-weight: bold; font-size: 17px; text-shadow: 0 2px 8px rgba(0,0,0,0.6); }
:deep(.van-hairline--bottom:after) { border-bottom-width: 0 !important; }

/* 🚀 优化：黑色磨砂玻璃材质卡片 */
.dark-glass-card {
  background: rgba(23, 28, 38, 0.9) !important;
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.white-text { color: #ffffff !important; }

/* =========================================
   用户信息卡片
   ========================================= */
.profile-card { padding: 25px 20px; }
.user-info { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.avatar { width: 70px; height: 70px; border-radius: 50%; border: 2px solid #00e5ff; object-fit: cover; }
.username { font-size: 18px; font-weight: bold; color: #fff !important; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; }
.vip-tag { background: linear-gradient(90deg, #ff3b30, #ff8000); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 12px; font-weight: normal; }
.user-id { font-size: 12px; color: rgba(255,255,255,0.5); margin: 0; }

.asset-panel { display: flex; justify-content: space-around; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px 0; }
.asset-item .num { font-size: 18px; font-weight: bold; color: #00e5ff; font-family: 'DIN Alternate', sans-serif; margin-bottom: 5px; }
.asset-item .label { font-size: 12px; color: rgba(255,255,255,0.6); }

/* =========================================
   功能看板
   ========================================= */
.dashboard-card { margin-top: 15px; overflow: hidden; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.view-all { font-size: 13px; color: rgba(255,255,255,0.4); cursor: pointer; }

:deep(.custom-grid .van-grid-item__content) { background: transparent; padding: 20px 0; }
:deep(.custom-grid .van-grid-item__icon) { font-size: 28px; color: #00e5ff; }
:deep(.custom-grid .van-grid-item__text) { color: rgba(255,255,255,0.7); font-size: 13px; }

:deep(.custom-cell-group) { margin: 0; background: transparent; }
:deep(.custom-cell-group .van-cell) { background: transparent; padding: 16px 20px; color: rgba(255,255,255,0.9); }
:deep(.van-cell__left-icon) { color: #00e5ff; font-size: 20px; }
:deep(.van-cell__title) { color: #fff; }

.logout-wrap { margin: 30px 15px; }
.logout-btn { background: rgba(255,255,255,0.1); color: #ff3b30; border: 1px solid rgba(255,59,48,0.3); font-weight: bold; }

/* 实名认证弹窗表单 */
.auth-form { padding: 20px 10px; }
.auth-tips { font-size: 11px; color: #999; margin: 15px 15px 0 15px; line-height: 1.4; }

/* --- 📱 手机端适配 --- */
@media (max-width: 767px) {
  .main-content { padding: 10px 15px 70px 15px; }
}

/* --- 💻 电脑端适配 --- */
@media (min-width: 768px) {
  .main-content {
    max-width: 1000px; margin: 0 auto;
    padding: 80px 15px 50px 15px; 
    display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start;
  }
  .profile-card { position: sticky; top: 80px; }
  .dashboard-card { margin-top: 0; margin-bottom: 20px; }
  .logout-btn:hover { background: #ff3b30; color: #fff; }
}
</style>