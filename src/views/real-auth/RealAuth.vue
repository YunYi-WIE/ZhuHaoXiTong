<template>
  <div class="real-auth-page">
    <van-nav-bar
      title="实名认证"
      left-arrow
      @click-left="router.back()"
      fixed
      placeholder
      z-index="999"
    />

    <main class="auth-container">
      <div class="auth-notice" v-if="!hasRealInfo">
        <van-icon name="info" />
        <p>根据国家相关规定，使用平台服务需要进行实名认证。您的信息将严格保密。</p>
      </div>

      <van-form @submit="handleSubmit" class="auth-form">
        <van-cell-group inset>
          <van-field
            v-model="form.realName"
            label="真实姓名"
            placeholder="请输入真实姓名"
            :rules="[{ required: true, message: '请输入真实姓名' }]"
          />
          <van-field
            v-model="form.idCard"
            label="身份证号"
            placeholder="请输入18位身份证号码"
            :rules="[
              { required: true, message: '请输入身份证号' },
              { validator: validateIdCard, message: '请输入有效的18位身份证号' }
            ]"
            maxlength="18"
          />
          <van-field
            v-model="form.phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { validator: validatePhone, message: '请输入有效的手机号' }
            ]"
            maxlength="11"
            type="tel"
          />
          <van-field
            v-model="form.bankCard"
            label="银行卡号"
            placeholder="请输入银行卡号（可选）"
            :rules="[{ validator: validateBankCard, message: '请输入有效的银行卡号' }]"
          />
        </van-cell-group>

        <div class="form-tips">
          <p>温馨提示：</p>
          <ul>
            <li>请确保填写的信息与身份证信息一致</li>
            <li>身份证信息将用于身份验证和提现安全</li>
            <li>银行卡号用于提现操作，可稍后绑定</li>
          </ul>
        </div>

        <div class="submit-btn-wrap">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            {{ hasRealInfo ? '更新认证信息' : '提交认证' }}
          </van-button>
        </div>
      </van-form>

      <div class="current-info" v-if="hasRealInfo">
        <h3>当前认证信息</h3>
        <van-cell-group inset>
          <van-cell title="真实姓名" :value="maskRealName(currentInfo.realName)" />
          <van-cell title="身份证号" :value="maskIdCard(currentInfo.idCard)" />
          <van-cell title="手机号" :value="maskPhone(currentInfo.phone)" />
          <van-cell title="银行卡号" :value="currentInfo.bankCard || '未绑定'" />
          <van-cell title="认证状态" value="已认证" />
        </van-cell-group>
        <p class="info-tip">如需修改信息，请在上方表单中更新并提交</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';
import { getUserRealInfo, createUserRealInfo, updateUserRealInfo } from '@/api/user';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const hasRealInfo = ref(false);
const currentInfo = ref({});

const form = ref({
  realName: '',
  idCard: '',
  phone: '',
  bankCard: ''
});

// 验证身份证号
const validateIdCard = (val) => {
  if (!val) return false;
  // 简单的身份证验证（18位）
  const reg = /^\d{17}[\dXx]$/;
  return reg.test(val);
};

// 验证手机号
const validatePhone = (val) => {
  if (!val) return false;
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(val);
};

// 验证银行卡号
const validateBankCard = (val) => {
  if (!val || val.trim() === '') return true; // 可选字段
  const reg = /^\d{16,19}$/;
  return reg.test(val);
};

// 获取当前实名信息
const fetchRealInfo = async () => {
  try {
    const res = await getUserRealInfo();
    if (res && res.id) {
      hasRealInfo.value = true;
      currentInfo.value = res;
      // 填充表单
      form.value = {
        realName: res.realName || '',
        idCard: res.idCard || '',
        phone: res.phone || '',
        bankCard: res.bankCard || ''
      };
    } else {
      hasRealInfo.value = false;
      currentInfo.value = {};
    }
  } catch (error) {
    console.error('获取实名信息失败:', error);
    // 如果没有实名信息，清空状态
    hasRealInfo.value = false;
    currentInfo.value = {};
  }
};

// 提交表单
const handleSubmit = async () => {
  loading.value = true;
  console.log('Submitting real auth form:', form.value);
  try {
    const data = { ...form.value };

    if (hasRealInfo.value) {
      // 更新实名信息
      console.log('Updating existing real info, id:', currentInfo.value.id);
      await updateUserRealInfo(currentInfo.value.id, data);
      showToast('认证信息更新成功');
    } else {
      // 新增实名信息
      console.log('Creating new real info');
      await createUserRealInfo(data);
      showToast('实名认证成功');
    }

    // 重新获取最新信息
    await fetchRealInfo();

    // 根据来源页面返回并触发刷新
    const from = route.query.from || 'setting';
    let targetPath = '/setting';
    if (from === 'mine') {
      targetPath = '/mine';
    } else if (from === 'pc-user-center') {
      // PC用户中心路径，根据实际路由配置可能需要调整
      targetPath = '/pc-user-center';
    }

    console.log(`Returning to ${targetPath} with refresh flag, from: ${from}`);

    setTimeout(() => {
      // 使用查询参数触发目标页面刷新
      router.push(`${targetPath}?refresh=true`);
    }, 1500);
  } catch (error) {
    console.error('提交实名信息失败:', error);
    showToast(error.message || '提交失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 信息脱敏显示
const maskRealName = (name) => {
  if (!name) return '';
  if (name.length <= 2) return name.charAt(0) + '*';
  return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
};

const maskIdCard = (idCard) => {
  if (!idCard || idCard.length < 18) return '';
  return idCard.substring(0, 6) + '********' + idCard.substring(14);
};

const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return '';
  return phone.substring(0, 3) + '****' + phone.substring(7);
};

onMounted(() => {
  fetchRealInfo();
});
</script>

<style scoped>
.real-auth-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.auth-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px 16px 40px;
}

.auth-notice {
  background: linear-gradient(135deg, #e6f7ff, #f0f7ff);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border-left: 4px solid #1989fa;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.auth-notice .van-icon {
  color: #1989fa;
  font-size: 18px;
  margin-top: 2px;
  flex-shrink: 0;
}

.auth-notice p {
  margin: 0;
  font-size: 13px;
  color: #333;
  line-height: 1.5;
}

.form-tips {
  background: #fff8e1;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 20px 16px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.form-tips p {
  margin: 0 0 6px 0;
  font-weight: bold;
  color: #856404;
}

.form-tips ul {
  margin: 0;
  padding-left: 18px;
}

.form-tips li {
  margin-bottom: 4px;
}

.submit-btn-wrap {
  margin: 30px 16px 20px;
}

.current-info {
  margin-top: 30px;
}

.current-info h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 12px 16px;
  font-weight: bold;
}

.info-tip {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 12px;
  padding: 0 16px;
}
</style>