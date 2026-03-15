<template>
  <div class="login-page">
    <van-nav-bar title="欢迎登录" left-arrow @click-left="router.back()" />

    <div class="login-container">
      <div class="brand-box">
        <img src="@/assets/logo.png" class="login-logo" />
        <h2 class="brand-name">哈小龙小店</h2>
      </div>

      <van-tabs v-model:active="activeTab" color="#ff3b30" animated>
        <van-tab title="手机号登录" name="mobile">
          <van-form @submit="handleLogin" class="custom-form">
            <van-cell-group inset>
              <van-field v-model="loginForm.phone" label="手机号" placeholder="请输入手机号" type="tel" />
              <van-field v-model="loginForm.code" label="验证码" placeholder="请输入验证码">
                <template #button>
                  <van-button size="small" type="primary" plain round color="#ff3b30">获取验证码</van-button>
                </template>
              </van-field>
            </van-cell-group>
            <div class="submit-wrap">
              <van-button round block type="primary" native-type="submit" color="#ff3b30">立即登录</van-button>
            </div>
          </van-form>
        </van-tab>

        <van-tab title="账号密码" name="password">
          <van-form @submit="handleLogin" class="custom-form">
            <van-cell-group inset>
              <van-field v-model="loginForm.username" label="账号" placeholder="用户名/手机号/邮箱" />
              <van-field v-model="loginForm.password" label="密码" type="password" placeholder="请输入密码" />
            </van-cell-group>
            <div class="submit-wrap">
              <van-button round block type="primary" native-type="submit" color="#ff3b30">进入小店</van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>

      <div class="third-party-login">
        <van-divider>其他登录方式</van-divider>
        <div class="wechat-icon-box" @click="handleWechatLogin">
          <van-icon name="wechat" color="#07c160" size="40" />
          <p>微信一键登录</p>
        </div>
      </div>

      <div class="protocol-box">
        <van-checkbox v-model="checked" icon-size="14px" checked-color="#ff3b30">
          登录即代表同意 <span class="link">《用户服务协议》</span> 和 <span class="link">《隐私政策》</span>
        </van-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';

const router = useRouter();
const activeTab = ref('mobile'); // 默认选中手机号登录
const checked = ref(false); // 协议勾选

// 登录表单数据
const loginForm = reactive({
  phone: '',
  code: '',
  username: '',
  password: ''
});

// 处理登录逻辑 (手机号 & 账号密码通用)
const handleLogin = () => {
  if (!checked.value) {
    showFailToast('请先阅读并勾选协议');
    return;
  }

  showLoadingToast({ message: '登录中...', forbidClick: true });

  // 模拟接口请求
  setTimeout(() => {
    showSuccessToast('欢迎回来！');
    // 成功后跳转到大厅
    router.push('/lobby');
  }, 1000);
};

// 处理微信登录
const handleWechatLogin = () => {
  if (!checked.value) {
    showFailToast('请先勾选协议');
    return;
  }
  showLoadingToast('正在拉取微信授权...');
  // 模拟成功
  setTimeout(() => {
    router.push('/lobby');
  }, 1500);
};
</script>

<style scoped>
/* 🚀 1. 把整个页面变成垂直方向的弹性盒子 */
.login-page { 
  background: #fff; 
  min-height: 100vh; 
  display: flex;
  flex-direction: column; /* 垂直排列 */
}
/* 🚀 2. 让中间的容器撑满剩余空间 */
.login-container { 
  flex: 1; /* 自动撑开，把底部的协议往下挤 */
  padding: 30px 10px; 
  display: flex;
  flex-direction: column;
}
.brand-box { text-align: center; margin-bottom: 30px; }
.login-logo { width: 70px; height: 70px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
.brand-name { margin-top: 10px; font-size: 18px; font-weight: bold; color: #333; }

.custom-form { margin-top: 15px; }
.submit-wrap { margin: 30px 16px; }

.third-party-login { margin-top: 40px; text-align: center; }
.wechat-icon-box { display: inline-block; margin-top: 10px; cursor: pointer; }
.wechat-icon-box p { font-size: 12px; color: #999; margin-top: 5px; }

/* 🚀 3. 核心：利用 margin-top: auto 自动顶到最下面 */
.protocol-box {
  margin-top: auto; /* 神奇的一笔：不管上面内容多少，自动把自己推到容器最底部 */
  padding-bottom: calc(30px + env(safe-area-inset-bottom)); /* 预留底部安全距离 */
  display: flex;
  justify-content: center;
  font-size: 12px;
}

/* 协议里的特殊文字颜色 */
.link { color: #ff3b30; }

/* 防止屏幕太小（比如旧款小屏手机）时，上面的输入框被底部的协议挡住，给主容器加点底边距 */
.login-container { 
  padding: 30px 10px 80px 10px; 
}
</style>