<template>
  <div class="login-page">
    <van-nav-bar 
      title="欢迎登录" 
      left-arrow 
      @click-left="router.back()" 
      class="transparent-nav" 
      :border="false"
    />

    <div class="login-wrapper">
      <div class="brand-box">
        <img src="@/assets/logo.png" class="login-logo glow-effect" />
        <h2 class="brand-name neon-text">哈小龙小店</h2>
        <p class="brand-slogan">全网最专业的游戏账号租赁平台</p>
      </div>

      <div class="login-card">
        <van-tabs v-model:active="activeTab" color="#1900ff" animated class="custom-tabs">
          <van-tab title="手机号登录" name="mobile">
            <van-form @submit="handleLogin" class="custom-form">
              <van-cell-group inset class="input-group">
                <van-field v-model="loginForm.phone" placeholder="请输入手机号" type="tel" left-icon="phone-o" clearable />
                <van-field v-model="loginForm.code" placeholder="请输入验证码" left-icon="comment-circle-o">
                  <template #button>
                    <span class="send-code-btn">获取验证码</span>
                  </template>
                </van-field>
              </van-cell-group>
              <div class="submit-wrap">
                <van-button round block native-type="submit" class="gradient-btn">立即登录</van-button>
              </div>
            </van-form>
          </van-tab>

          <van-tab title="账号密码" name="password">
            <van-form @submit="handleLogin" class="custom-form">
              <van-cell-group inset class="input-group">
                <van-field v-model="loginForm.username" placeholder="用户名 / 手机号" left-icon="user-o" clearable />
                <van-field v-model="loginForm.password" type="password" placeholder="请输入密码" left-icon="lock" clearable />
              </van-cell-group>
              <div class="submit-wrap">
                <van-button round block native-type="submit" class="gradient-btn">进入小店</van-button>
              </div>
            </van-form>
          </van-tab>
        </van-tabs>

        <div class="third-party-login">
          <van-divider class="custom-divider">其他登录方式</van-divider>
          <div class="wechat-icon-box" @click="handleWechatLogin">
            <van-icon name="wechat" class="wechat-icon" />
            <p>微信一键登录</p>
          </div>
        </div>
      </div>

      <div class="protocol-box">
        <van-checkbox v-model="checked" icon-size="16px" checked-color="#1900ff">
          <span class="protocol-text">
            登录即代表同意 <span class="link">《用户服务协议》</span> 和 <span class="link">《隐私政策》</span>
          </span>
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
const activeTab = ref('mobile'); 
const checked = ref(false); 

const loginForm = reactive({
  phone: '',
  code: '',
  username: '',
  password: ''
});

const handleLogin = () => {
  if (!checked.value) {
    showFailToast('请先阅读并勾选协议');
    return;
  }
  showLoadingToast({ message: '登录中...', forbidClick: true });

  setTimeout(() => {
    showSuccessToast('欢迎回来！');
    router.push('/lobby');
  }, 1000);
};

const handleWechatLogin = () => {
  if (!checked.value) {
    showFailToast('请先勾选协议');
    return;
  }
  showLoadingToast('正在拉取微信授权...');
  setTimeout(() => {
    router.push('/lobby');
  }, 1500);
};
</script>

<style scoped>
/* =========================================
   全局背景与导航栏
   ========================================= */
.login-page { 
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh; 
  display: flex;
  flex-direction: column; 
}

/* 强制透明导航栏并改白字 */
:deep(.transparent-nav) { background: transparent !important; }
:deep(.transparent-nav .van-nav-bar__title),
:deep(.transparent-nav .van-icon) { color: #fff !important; font-weight: bold; }

/* =========================================
   布局容器 (响应式居中)
   ========================================= */
.login-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
}

/* =========================================
   Logo与品牌标题 (电竞发光)
   ========================================= */
.brand-box { text-align: center; margin-top: 2vh; margin-bottom: 30px; }
.login-logo { width: 75px; height: 75px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.2); }
.glow-effect { box-shadow: 0 0 15px rgba(25, 0, 255, 0.5); }
.brand-name { margin: 12px 0 5px 0; font-size: 24px; letter-spacing: 2px; }
.neon-text { color: #fff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(0, 229, 255, 0.8); }
.brand-slogan { color: rgba(255,255,255,0.8); font-size: 13px; }

/* =========================================
   白色悬浮登录卡片
   ========================================= */
.login-card {
  width: 100%;
  max-width: 420px; /* PC 端限制最大宽度，变身悬浮卡片 */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px 15px 30px 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;
}

/* Vant Tab 样式覆写 */
:deep(.custom-tabs .van-tabs__nav) { background: transparent; }
:deep(.custom-tabs .van-tab--active) { font-weight: bold; font-size: 16px; }

/* 表单输入框优化 */
.custom-form { margin-top: 25px; }
.input-group { background: transparent; }
:deep(.van-cell) { 
  background: #f5f7fa !important; 
  border-radius: 12px; 
  margin-bottom: 15px; 
  padding: 12px 16px;
  align-items: center;
}
:deep(.van-field__left-icon) { font-size: 20px; color: #666; margin-right: 10px; }

/* 获取验证码文字 */
.send-code-btn { color: #1900ff; font-size: 13px; font-weight: bold; cursor: pointer; }
.send-code-btn:active { opacity: 0.7; }

/* 炫酷渐变提交按钮 */
.submit-wrap { margin-top: 30px; }
.gradient-btn {
  background: linear-gradient(90deg, #1900ff, #00e5ff);
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  height: 48px;
  box-shadow: 0 4px 15px rgba(25, 0, 255, 0.3);
  transition: transform 0.2s;
}
.gradient-btn:active { transform: scale(0.98); }

/* =========================================
   第三方登录
   ========================================= */
.third-party-login { margin-top: 30px; text-align: center; }
:deep(.custom-divider) { border-color: #eee; color: #999; padding: 0 30px; }
.wechat-icon-box { display: inline-block; margin-top: 10px; cursor: pointer; transition: transform 0.2s; }
.wechat-icon-box:hover { transform: scale(1.05); }
.wechat-icon { font-size: 42px; color: #07c160; background: #e6f9f0; border-radius: 50%; padding: 8px; }
.wechat-icon-box p { font-size: 12px; color: #666; margin-top: 8px; }

/* =========================================
   底部协议
   ========================================= */
.protocol-box {
  margin-top: auto; 
  padding: 30px 0 20px 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}
/* 🚀 修复 2：将底部文字改为深灰色，链接改为主题蓝，适应底部的白底 */
.protocol-text { color: #666666; font-size: 12px; }
.link { color: #1900ff; cursor: pointer; font-weight: bold; }

/* --- PC 端样式微调 --- */
@media (min-width: 768px) {
  .login-wrapper { justify-content: center; padding-top: 20px; }
  /* 🚀 修复 3：去掉之前的 margin-top: -50px，改为正边距，防止往上挤压导航栏 */
  .brand-box { margin-top: 15px; } 
  .protocol-box { margin-top: 30px; flex-grow: 0; }
}
</style>