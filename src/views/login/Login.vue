<template>
  <div class="login-page">
    <van-nav-bar title="登录" left-arrow @click-left="goBack" />
    
    <div class="login-container">
      <div class="logo-box">
        <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="logo" />
        <h2>欢迎来到哈基龙小店</h2>
      </div>

      <van-tabs v-model:active="activeTab" animated>
        <van-tab title="验证码登录">
          <van-form @submit="onSubmit" class="form-box">
            <van-cell-group inset>
              <van-field v-model="phone" name="phone" placeholder="请输入手机号" />
              <van-field v-model="sms" center clearable placeholder="请输入验证码">
                <template #button>
                  <van-button size="small" type="primary">发送验证码</van-button>
                </template>
              </van-field>
            </van-cell-group>
            <div style="margin: 24px 16px;">
              <van-button round block type="primary" native-type="submit">一键登录</van-button>
            </div>
          </van-form>
        </van-tab>

        <van-tab title="密码登录">
          <van-form @submit="onSubmit" class="form-box">
            <van-cell-group inset>
              <van-field v-model="phone" name="phone" placeholder="请输入手机号" />
              <van-field v-model="password" type="password" name="password" placeholder="请输入密码" />
            </van-cell-group>
            <div style="margin: 24px 16px;">
              <van-button round block type="primary" native-type="submit">登录</van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>

      <div class="wechat-login">
        <van-divider>其他登录方式</van-divider>
        <van-icon name="wechat" color="#07c160" size="45" @click="wechatLogin" />
        <p>微信登录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref(0);
const phone = ref('');
const sms = ref('');
const password = ref('');

const goBack = () => {
  router.back();
};

const onSubmit = (values) => {
  console.log('提交的表单数据:', values);
  // 模拟登录成功，跳回首页
  router.push('/home');
};

const wechatLogin = () => {
  console.log('触发微信登录逻辑');
  // 微信授权逻辑后续在这里写
};
</script>

<style scoped>
.login-page {
  background: #fff;
  min-height: 100vh;
}
.login-container {
  padding: 20px;
}
.logo-box {
  text-align: center;
  margin: 30px 0;
}
.logo-box .logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.logo-box h2 {
  font-size: 18px;
  margin: 0;
  color: #333;
}
.form-box {
  margin-top: 20px;
}
.wechat-login {
  margin-top: 60px;
  text-align: center;
}
.wechat-login p {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>