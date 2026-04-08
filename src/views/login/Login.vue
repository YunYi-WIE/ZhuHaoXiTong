<template>
  <div class="login-page">
    <van-nav-bar title="欢迎登录" left-arrow @click-left="router.back()" class="transparent-nav" :border="false" />

    <div class="login-wrapper">
      <div class="brand-box">
        <img :src="brandLogo" class="login-logo glow-effect" alt="" />
        <h2 class="brand-name neon-text">{{ siteName }}</h2>
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
            <div class="mock-qrcode">
              <img src="https://fastly.jsdelivr.net/npm/@vant/assets/qrcode.png" alt="微信二维码" class="qrcode-image" />
              <div class="qrcode-overlay">
                <van-icon name="wechat" size="40" color="#07c160" />
                <p class="scan-tips">请使用微信扫描二维码</p>
                <p class="mock-tips">（待接客户真实微信配置）</p>
              </div>
            </div>
            <div class="qrcode-actions">
              <van-button size="small" type="primary" plain @click="handleMockScan">确认扫码登录</van-button>
              <van-button size="small" type="default" @click="showQrCode = false">取消</van-button>
            </div>
            <p class="mock-description">当前为预留接入模式，客户配置 AppID 后可切换真实微信授权</p>
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
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { showSuccessToast, showFailToast, showLoadingToast, closeToast } from 'vant';
import { sendCodeApi, loginByPasswordApi, loginByWechatApi, getWechatLoginConfigApi } from '@/api/auth';
import { useSiteBrandingStore } from '@/stores/siteBranding';

const branding = useSiteBrandingStore();
const { siteName, effectiveLogo: brandLogo } = storeToRefs(branding);

const router = useRouter();
const route = useRoute(); // 用于获取 URL 参数
const activeTab = ref('password'); // 默认显示密码登录，验证码登录接口未实现 
const checked = ref(false); 
const isSending = ref(false);
const countdown = ref(0);
const showQrCode = ref(false);
const wechatConfig = ref({ appId: '', configured: false });

const loginForm = reactive({
  phone: '',
  code: '',
  username: '13336879228',
  password: '123456',
});

onMounted(async () => {
  const wxCode = route.query.code;
  try {
    const conf = await getWechatLoginConfigApi();
    wechatConfig.value = {
      appId: conf?.appId || '',
      configured: !!conf?.configured
    };
  } catch (_) {
    wechatConfig.value = { appId: '', configured: false };
  }
  if (wxCode) {
    await completeWechatLogin(String(wxCode));
  }
});

const handleWechatLogin = () => {
  if (!checked.value) return showFailToast('请先阅读并勾选协议');
  const isWechatBrowser = /MicroMessenger/i.test(navigator.userAgent);

  if (isWechatBrowser && wechatConfig.value.configured && wechatConfig.value.appId) {
    const appId = encodeURIComponent(wechatConfig.value.appId);
    const redirectUri = encodeURIComponent(`${window.location.origin}${window.location.pathname}`);
    const state = encodeURIComponent('hxl_login');
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    window.location.href = authUrl;
    return;
  }
  if (isWechatBrowser) {
    showFailToast('微信AppID尚未配置，请联系管理员配置后再使用');
    return;
  }
  showQrCode.value = true;
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
    showFailToast(error.message || '发送验证码失败');
  }
};

// 登录
const handleLogin = async () => {
  if (!checked.value) return showFailToast('请先阅读并勾选协议');
  showLoadingToast({ message: '登录中...', forbidClick: true, duration: 0 });

  try {
    let res;
    if (activeTab.value === 'mobile') {
      closeToast();
      showFailToast('验证码登录功能暂未开放，请使用密码登录');
      activeTab.value = 'password';
      if (loginForm.phone && !loginForm.username) {
        loginForm.username = loginForm.phone;
      }
      return;
    }
    if (!loginForm.username || !loginForm.password) {
      closeToast();
      return showFailToast('请填写完整');
    }
    const smsVo = await sendCodeApi(String(loginForm.username).trim());
    const smsCode = smsVo?.smsCode;
    if (!smsCode) {
      closeToast();
      return showFailToast('获取验证码失败，请稍后重试');
    }
    res = await loginByPasswordApi({
      phone: String(loginForm.username).trim(),
      password: loginForm.password,
      smsCode,
    });

    const actualToken = res.tokenValue || res.token || res;
    localStorage.setItem('token', actualToken);
    closeToast();
    showSuccessToast('登录成功！');
    const redirect = route.query?.redirect ? String(route.query.redirect) : '';
    if (redirect && redirect.startsWith('/')) {
      router.replace(redirect);
    } else {
      router.push('/home');
    }
  } catch (error) {
    closeToast();
    showFailToast(error?.message || '登录失败');
  }
};

const handleMockWechatLogin = async () => {
  const mockCode = 'mock_wx_code_' + Date.now();
  await completeWechatLogin(mockCode, true);
};

// 模拟扫码按钮点击
const handleMockScan = async () => {
  await handleMockWechatLogin();
};

const completeWechatLogin = async (code, closeQr = false) => {
  showLoadingToast({ message: '正在微信登录...', forbidClick: true, duration: 0 });
  try {
    const res = await loginByWechatApi(code);
    const actualToken = res.tokenValue || res.token || res;
    localStorage.setItem('token', actualToken);
    showSuccessToast('微信登录成功！');
    const redirect = route.query?.redirect ? String(route.query.redirect) : '';
    if (redirect && redirect.startsWith('/')) {
      router.replace(redirect);
    } else {
      router.replace('/home');
    }
  } catch (error) {
    showFailToast(error.message || '微信登录失败');
    router.replace('/login');
  } finally {
    closeToast();
    if (closeQr) showQrCode.value = false;
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

@media (max-width: 380px) {
  .login-wrapper {
    padding: 12px 10px;
  }
  .brand-box {
    margin-top: 0;
    margin-bottom: 18px;
  }
  .login-logo {
    width: 64px;
    height: 64px;
  }
  .brand-name {
    font-size: 20px;
    margin-top: 10px;
  }
  .login-card {
    border-radius: 14px;
    padding: 14px 10px 20px;
  }
  .custom-form {
    margin-top: 14px;
  }
  .submit-wrap {
    margin-top: 18px;
  }
  .protocol-box {
    padding-top: 16px;
  }
}

@media (min-width: 768px) {
  .login-wrapper {
    justify-content: center;
    padding-top: 20px;
  }
  .brand-box {
    margin-top: 15px;
  }
  .protocol-box {
    margin-top: 30px;
    flex-grow: 0;
  }
}

@media (min-width: 768px) and (max-width: 1099px) {
  .login-card {
    max-width: 500px;
  }
}
/* 模拟二维码容器样式 */
.qr-code-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eee;
}

.mock-qrcode {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.qrcode-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  filter: blur(1px);
  opacity: 0.8;
}

.qrcode-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

.scan-tips {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.mock-tips {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.qrcode-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.mock-description {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 10px;
  max-width: 300px;
  line-height: 1.4;
}
</style>