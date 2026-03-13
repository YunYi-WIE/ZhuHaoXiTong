<template>
  <div class="pc-login-page">
    <div class="login-box">
      <div class="login-left">
        <div class="brand-info">
          <img src="@/assets/logo.png" class="brand-logo" />
          <h2>哈小龙小店</h2>
          <p>专业、安全、快捷的游戏账号租赁平台</p>
        </div>
      </div>
      
      <div class="login-right">
        <h3 class="form-title">欢迎登录</h3>
        
        <el-form :model="form" class="login-form">
          <el-form-item>
            <el-input v-model="form.phone" placeholder="请输入手机号" size="large" prefix-icon="Iphone" clearable />
          </el-form-item>
          
          <el-form-item>
            <div class="code-input-box">
              <el-input v-model="form.code" placeholder="验证码" size="large" prefix-icon="Lock" />
              <el-button class="send-btn" size="large">获取验证码</el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="form.agreed">
              我已阅读并同意 <el-link type="primary" :underline="false">《用户服务协议》</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="danger" size="large" class="submit-btn" @click="handleLogin">登录 / 注册</el-button>
          </el-form-item>
        </el-form>

        <div class="other-login">
          <el-divider>其他登录方式</el-divider>
          <el-button circle icon="ChatDotRound" type="success" plain title="微信登录"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const form = reactive({
  phone: '',
  code: '',
  agreed: false
});

const handleLogin = () => {
  if (!form.phone) return ElMessage.warning('请输入手机号');
  if (!form.agreed) return ElMessage.warning('请先同意用户服务协议');
  
  ElMessage.success('登录成功！');
  router.push('/pc-home');
};
</script>

<style scoped>
.pc-login-page {
  /* 高级电竞风渐变背景 */
  background: linear-gradient(135deg, #1bcedf 0%, #4b126a 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 900px;
  height: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  display: flex;
  overflow: hidden;
}

.login-left {
  width: 400px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-right: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'); /* 放一张酷炫电竞背景图 */
  background-size: cover;
  background-position: center;
  position: relative;
}
.login-left::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6); /* 黑色半透明遮罩 */
}

.brand-info {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
}
.brand-logo { width: 80px; height: 80px; border-radius: 12px; border: 2px solid #fff; margin-bottom: 20px; }
.brand-info h2 { font-size: 28px; margin: 0 0 10px; }
.brand-info p { font-size: 14px; opacity: 0.8; }

.login-right {
  flex: 1;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-title { font-size: 24px; color: #333; margin-top: 0; margin-bottom: 30px; text-align: center; }

.login-form { width: 100%; }
.code-input-box { display: flex; width: 100%; gap: 10px; }
.send-btn { width: 120px; }
.submit-btn { width: 100%; font-size: 16px; font-weight: bold; margin-top: 10px; }

.other-login { text-align: center; margin-top: 20px; }
</style>