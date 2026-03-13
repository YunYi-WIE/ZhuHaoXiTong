<template>
  <div class="settings-page">
    <van-nav-bar title="设置" left-arrow @click-left="goBack" />
    
    <div class="settings-group">
      <van-cell-group inset>
        <van-cell title="修改密码" is-link />
        <van-cell title="绑定手机号" is-link value="138****8888" />
        <van-cell title="实名认证" is-link value="未认证" />
      </van-cell-group>
    </div>

    <div class="settings-group">
      <van-cell-group inset>
        <van-cell title="清除缓存" is-link value="12.5MB" @click="clearCache" />
        <van-cell title="关于我们" is-link />
        <van-cell title="当前版本" value="V1.0.0" />
      </van-cell-group>
    </div>

    <div class="logout-btn-box">
      <van-button block round type="danger" @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';

const router = useRouter();

const goBack = () => {
  router.back();
};

const clearCache = () => {
  showToast('缓存清理成功');
};

const handleLogout = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要退出当前账号吗？',
  }).then(() => {
    // 模拟清理 token
    localStorage.removeItem('token');
    showToast('已退出登录');
    router.replace('/login');
  }).catch(() => {
    // 点击取消，什么都不做
  });
};
</script>

<style scoped>
.settings-page {
  background: #f7f8fa;
  min-height: 100vh;
}
.settings-group {
  margin-top: 16px;
}
.logout-btn-box {
  margin: 30px 16px;
}
</style>