<template>
  <div class="setting-page">
    <van-nav-bar 
      title="系统设置" 
      left-arrow 
      @click-left="onClickLeft"
      class="custom-nav"
      :border="false"
    />

    <div class="panel-box menu-panel">
      <van-cell-group :border="false" class="custom-cell-group">
        <van-cell title="个人资料" is-link class="custom-cell" />
        <van-cell title="账号与安全" is-link class="custom-cell" />
        <van-cell title="支付设置" is-link class="custom-cell" />
      </van-cell-group>
    </div>

    <div class="panel-box menu-panel">
      <van-cell-group :border="false" class="custom-cell-group">
        <van-cell title="消息通知" is-link class="custom-cell" />
        <van-cell title="清除缓存" is-link value="12.8 MB" class="custom-cell value-neon" />
        <van-cell title="检查更新" is-link value="已是最新版" class="custom-cell value-gray" />
        <van-cell title="关于哈小龙小店" is-link class="custom-cell" />
      </van-cell-group>
    </div>

    <div class="logout-wrap">
      <button class="logout-btn" @click="handleLogout">退出当前账号</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const handleLogout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出当前账号吗？',
    confirmButtonColor: '#ff3b30'
  }).then(() => {
    // 确认退出
    showToast('已退出登录');
    setTimeout(() => {
      router.push('/login'); // 跳回登录页
    }, 800);
  }).catch(() => {
    // 取消退出，什么都不做
  });
};
</script>

<style scoped>
/* 🚀 核心 1：保持全局紫蓝渐变背景死死钉住 */
.setting-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  padding-bottom: 40px; 
}

/* 🚀 顶部导航栏透明化，白字 */
:deep(.custom-nav) { background: transparent !important; }
:deep(.van-hairline--bottom:after) { border-bottom-width: 0 !important; }
:deep(.custom-nav .van-nav-bar__title), 
:deep(.custom-nav .van-icon) { color: #fff !important; font-weight: bold; }

/* 🚀 核心 2：设置面板使用深色暗黑材质 */
.panel-box {
  background: #171c26;
  border-radius: 12px;
  margin: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
  overflow: hidden; /* 防止内部cell溢出圆角 */
}
.menu-panel { padding: 0; }

/* 🚀 单元格深度魔改 */
:deep(.custom-cell-group) { background: transparent; }
:deep(.custom-cell) { background: transparent; color: rgba(255,255,255,0.9); padding: 16px 15px; align-items: center; }
:deep(.custom-cell::after) { border-bottom: 1px solid rgba(255,255,255,0.05); left: 15px; right: 15px; }
:deep(.custom-cell:active) { background: rgba(255,255,255,0.05); } /* 点击态反馈 */
:deep(.custom-cell .van-cell__right-icon) { color: rgba(255,255,255,0.3); }

/* 右侧数值颜色定制 */
:deep(.value-neon .van-cell__value) { color: #00e5ff; font-weight: bold; text-shadow: 0 0 5px rgba(0, 229, 255, 0.4); } /* 荧光蓝 */
:deep(.value-gray .van-cell__value) { color: rgba(255,255,255,0.4); }

/* 🚀 退出按钮 */
.logout-wrap { margin-top: 40px; text-align: center; }
.logout-btn {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.5);
  color: #ff3b30;
  width: 85%; 
  padding: 12px 0; 
  border-radius: 25px;
  font-size: 16px; 
  font-weight: bold;
  transition: all 0.2s;
}
.logout-btn:active { background: #ff3b30; color: #fff; box-shadow: 0 4px 15px rgba(255, 59, 48, 0.4); transform: scale(0.98); }
</style>