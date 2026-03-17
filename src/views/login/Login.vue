<template>
  <div class="login-page">
    <van-nav-bar title="欢迎登录" left-arrow @click-left="router.back()" class="transparent-nav" :border="false" />

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
                    <span class="send-code-btn" @click="handleSendCode">
                      {{ isSending ? `${countdown}s后重发` : '获取验证码' }}
                    </span>
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
                <van-field v-model="loginForm.username" placeholder="请输入手机号" left-icon="user-o" clearable />
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
          
          <div class="wechat-icon-box" @click="handleWechatLogin" v-if="!showQrCode">
            <van-icon name="wechat" class="wechat-icon" />
            <p>微信扫码登录</p>
          </div>

          <div v-show="showQrCode" class="qr-code-wrapper">
            <div id="wechat-qrcode"></div>
            <p class="cancel-text" @click="showQrCode = false">取消扫码</p>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant';
// 🚀 引入所有的 auth API，包括刚写的微信登录 API
import { sendCodeApi, loginByPasswordApi, loginByCodeApi, loginByWechatApi } from '@/api/auth';

const router = useRouter();
const route = useRoute(); // 用于获取 URL 参数
const activeTab = ref('mobile'); 
const checked = ref(false); 
const isSending = ref(false);
const countdown = ref(0);
const showQrCode = ref(false);

const loginForm = reactive({
  phone: '',
  code: '',
  username: '',
  password: ''
});

// ==========================================
// 🚀 核心：拦截微信授权回调，调用后端 API
// ==========================================
onMounted(async () => {
  // 1. 从网址栏提取微信返回的 code 参数
  const wxCode = route.query.code;
  
  // 2. 如果存在 code，说明是从微信授权跳回来的
  if (wxCode) {
    showLoadingToast({ message: '正在登录...', forbidClick: true, duration: 0 });
    
    try {
      // 3. 调用后端提供的真实 API，传入 wxCode
      const res = await loginByWechatApi(wxCode);
      
      // 4. 登录成功，保存后端返回的 token
      localStorage.setItem('token', res.token || res);
      showSuccessToast('微信登录成功！');
      
      // 5. 跳转到租号大厅（使用 replace 防止用户按返回键又回到带有 code 的网址）
      router.replace('/lobby'); 
    } catch (error) {
      // 失败的话（例如 code 过期），清理网址参数留在登录页
      showFailToast(error.message || '微信登录失败');
      router.replace('/login');
    }
  }
});

// ==========================================
// 🚀 点击微信图标，发起微信授权请求
// ==========================================
const handleWechatLogin = () => {
  if (!checked.value) return showFailToast('请先阅读并勾选协议');
  
  // 区分环境：如果是手机微信内置浏览器打开，走 H5 授权；如果是 PC 端，走扫码
  const isWechatBrowser = /MicroMessenger/i.test(navigator.userAgent);

  const APP_ID = 'wx86001ff5b480c6d1'; // ⚠️ 请替换为你真实的 AppID
  const REDIRECT_URI = encodeURIComponent(window.location.origin + '/login');

  if (isWechatBrowser) {
    // 【手机微信环境】直接跳微信授权页
    showLoadingToast({ message: '正在拉取授权...', forbidClick: true });
    const wxAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    window.location.href = wxAuthUrl;
  } else {
    // 【电脑浏览器环境】使用上一次教你的内嵌二维码方案
    showQrCode.value = true;
    
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
      document.body.appendChild(script);

      script.onload = () => {
        new window.WxLogin({
          self_redirect: false,
          id: "wechat-qrcode", 
          appid: APP_ID, 
          scope: "snsapi_login", 
          redirect_uri: REDIRECT_URI,
          state: "STATE",
          style: "black"
        });
      };
    }, 100); // 稍微延迟等待 DOM 渲染
  }
};

// 发送验证码
const handleSendCode = async () => {
  if (!loginForm.phone) return showFailToast('请输入手机号');
  if (isSending.value) return;

  try {
    isSending.value = true;
    await sendCodeApi(loginForm.phone);
    showSuccessToast('验证码已发送');
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        isSending.value = false;
      }
    }, 1000);
  } catch (error) {
    isSending.value = false;
  }
};

// 登录
const handleLogin = async () => {
  if (!checked.value) return showFailToast('请先阅读并勾选协议');
  showLoadingToast({ message: '登录中...', forbidClick: true });

  try {
    let res;
    if (activeTab.value === 'mobile') {
      if (!loginForm.phone || !loginForm.code) return showFailToast('请填写完整');
      res = await loginByCodeApi({ phone: loginForm.phone, code: loginForm.code });
    } else {
      if (!loginForm.username || !loginForm.password) return showFailToast('请填写完整');
      res = await loginByPasswordApi({ phone: loginForm.username, password: loginForm.password });
    }
    
    // 假设后端返回的 token 在 res.token 中，如果直接是字符串则为 res
    localStorage.setItem('token', res.token || res || 'dummy_token'); 
    showSuccessToast('登录成功！');
    router.push('/home');
  } catch (error) {
    // 报错已在 request.js 拦截器中提示
  }
};
</script>

<style scoped>
.login-page { background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%); background-attachment: fixed; min-height: 100vh; display: flex; flex-direction: column; }
:deep(.transparent-nav) { background: transparent !important; }
:deep(.transparent-nav .van-nav-bar__title), :deep(.transparent-nav .van-icon) { color: #fff !important; font-weight: bold; }
.login-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 20px 15px; }
.brand-box { text-align: center; margin-top: 2vh; margin-bottom: 30px; }
.login-logo { width: 75px; height: 75px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.2); }
.glow-effect { box-shadow: 0 0 15px rgba(25, 0, 255, 0.5); }
.brand-name { margin: 12px 0 5px 0; font-size: 24px; letter-spacing: 2px; }
.neon-text { color: #fff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(0, 229, 255, 0.8); }
.brand-slogan { color: rgba(255,255,255,0.8); font-size: 13px; }
.login-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px 15px 30px 15px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15); position: relative; z-index: 10; }
:deep(.custom-tabs .van-tabs__nav) { background: transparent; }
:deep(.custom-tabs .van-tab--active) { font-weight: bold; font-size: 16px; }
.custom-form { margin-top: 25px; }
.input-group { background: transparent; }
:deep(.van-cell) { background: #f5f7fa !important; border-radius: 12px; margin-bottom: 15px; padding: 12px 16px; align-items: center; }
:deep(.van-field__left-icon) { font-size: 20px; color: #666; margin-right: 10px; }
.send-code-btn { color: #1900ff; font-size: 13px; font-weight: bold; cursor: pointer; }
.send-code-btn:active { opacity: 0.7; }
.submit-wrap { margin-top: 30px; }
.gradient-btn { background: linear-gradient(90deg, #1900ff, #00e5ff); border: none; color: #fff; font-size: 16px; font-weight: bold; height: 48px; box-shadow: 0 4px 15px rgba(25, 0, 255, 0.3); transition: transform 0.2s; }
.gradient-btn:active { transform: scale(0.98); }
.third-party-login { margin-top: 30px; text-align: center; }
:deep(.custom-divider) { border-color: #eee; color: #999; padding: 0 30px; }
.wechat-icon-box { display: inline-block; margin-top: 10px; cursor: pointer; transition: transform 0.2s; }
.wechat-icon-box:hover { transform: scale(1.05); }
.wechat-icon { font-size: 42px; color: #07c160; background: #e6f9f0; border-radius: 50%; padding: 8px; }
.wechat-icon-box p { font-size: 12px; color: #666; margin-top: 8px; }
.protocol-box { margin-top: auto; padding: 30px 0 20px 0; display: flex; justify-content: center; z-index: 10; }
.protocol-text { color: #666666; font-size: 12px; }
.link { color: #1900ff; cursor: pointer; font-weight: bold; }
@media (min-width: 768px) { .login-wrapper { justify-content: center; padding-top: 20px; } .brand-box { margin-top: 15px; } .protocol-box { margin-top: 30px; flex-grow: 0; } }
/* 扫码二维码容器样式 */
.qr-code-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
#wechat-qrcode {
  height: 300px; /* 微信二维码默认高度 */
}
.cancel-text {
  color: #999;
  font-size: 13px;
  cursor: pointer;
  margin-top: 5px;
  transition: color 0.2s;
}
.cancel-text:hover {
  color: #ff3b30;
}
</style>