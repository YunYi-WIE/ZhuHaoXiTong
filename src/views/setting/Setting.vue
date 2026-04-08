<template>
  <div class="setting-page">
    <NavBar class="desktop-nav-bar" />

    <van-nav-bar
      title="系统设置"
      left-arrow
      @click-left="router.back()"
      fixed
      placeholder
      z-index="999"
      class="mobile-nav-bar"
    />

    <main class="setting-container page-shell">
      <div class="section-title">个人信息</div>
      <van-cell-group inset>
        <van-cell title="头像" is-link center @click="openProfileForm">
          <template #value>
            <van-image
              round
              width="40"
              height="40"
              :src="displayAvatar"
            />
          </template>
        </van-cell>
        <van-cell title="昵称" :value="displayNickname" is-link @click="openProfileForm" />
        <van-cell
          title="性别"
          :value="genderLabel"
          is-link
          @click="openGenderCell"
        />
        <van-cell title="我的二维码" is-link icon="qr" @click="showQrDialog = true" />
      </van-cell-group>

      <div class="section-title">安全与隐私</div>
      <van-cell-group inset>
        <van-cell title="修改登录密码" is-link @click="onChangePassword" />
        <van-cell
          title="手机号"
          :value="userInfo.phone ? maskPhone(userInfo.phone) : '未绑定'"
          is-link
          @click="onPhoneHint"
        />
        <van-cell
          title="实名认证"
          :value="userInfo.isRealAuth ? '已认证' : '未认证'"
          is-link
          @click="handleRealAuth"
        />
      </van-cell-group>

      <div class="section-title">通用</div>
      <van-cell-group inset>
        <van-cell title="清除本地缓存" is-link :value="cacheSize" @click="handleClearCache" />
        <van-cell title="新消息通知">
          <template #right-icon>
            <van-switch v-model="notification" size="20px" @change="persistNotification" />
          </template>
        </van-cell>
        <van-cell title="关于狙击电竞" :value="appVersion" is-link @click="showAbout = true" />
      </van-cell-group>

      <div class="logout-wrap">
        <van-button block type="danger" plain round @click="handleLogout">退出当前账号</van-button>
      </div>

      <div class="footer-tips">
        <p>© 2026 狙击电竞租号平台 版权所有</p>
      </div>
    </main>

    <!-- 编辑资料 -->
    <van-popup v-model:show="showProfilePopup" position="bottom" round :style="{ padding: '16px 16px 24px' }">
      <div class="popup-title">编辑资料</div>
      <van-form @submit="submitProfile">
        <van-cell-group inset>
          <van-field
            v-model="profileForm.username"
            label="昵称"
            placeholder="2–20 个字符"
            maxlength="20"
            show-word-limit
            :rules="[{ required: true, message: '请填写昵称' }]"
          />
          <van-field label="头像" readonly>
            <template #input>
              <div class="avatar-uploader">
                <van-image round width="44" height="44" :src="displayAvatar" />
                <van-uploader
                  :after-read="afterReadAvatar"
                  :max-count="1"
                  :disabled="avatarUploading"
                  accept="image/*"
                >
                  <van-button size="small" type="primary" plain :loading="avatarUploading">
                    更换头像
                  </van-button>
                </van-uploader>
              </div>
            </template>
          </van-field>
        </van-cell-group>
        <div class="popup-actions">
          <van-button round block type="default" native-type="button" @click="showProfilePopup = false">
            取消
          </van-button>
          <van-button round block type="primary" native-type="submit" :loading="profileSaving">保存</van-button>
        </div>
      </van-form>
    </van-popup>

    <!-- 修改密码 -->
    <van-popup v-model:show="showPasswordPopup" position="bottom" round :style="{ padding: '16px 16px 24px' }">
      <div class="popup-title">修改登录密码</div>
      <van-form @submit="submitPassword">
        <van-cell-group inset>
          <van-field
            v-model="passwordForm.oldPassword"
            label="旧密码"
            type="password"
            placeholder="请输入旧密码"
            :rules="[{ required: true, message: '请输入旧密码' }]"
          />
          <van-field
            v-model="passwordForm.newPassword"
            label="新密码"
            type="password"
            placeholder="6-32位"
            :rules="[{ required: true, message: '请输入新密码' }]"
          />
          <van-field
            v-model="passwordForm.confirmPassword"
            label="确认新密码"
            type="password"
            placeholder="再次输入新密码"
            :rules="[{ required: true, message: '请确认新密码' }]"
          />
        </van-cell-group>
        <div class="popup-actions">
          <van-button round block type="default" native-type="button" @click="showPasswordPopup = false">
            取消
          </van-button>
          <van-button round block type="primary" native-type="submit" :loading="passwordSaving">确认修改</van-button>
        </div>
      </van-form>
    </van-popup>

    <!-- 性别：Vant 4 要求 columns 为 { text, value }[] -->
    <van-popup v-model:show="openGenderPicker" position="bottom" round>
      <van-picker
        v-model="genderPickerValues"
        :columns="genderColumns"
        @confirm="onGenderConfirm"
        @cancel="openGenderPicker = false"
      />
    </van-popup>

    <!-- 我的二维码 -->
    <van-dialog v-model:show="showQrDialog" title="我的二维码" show-cancel-button>
      <div class="qr-wrap">
        <p class="qr-hint">邀请好友识别二维码或复制链接</p>
        <img v-if="qrImageUrl" class="qr-img" :src="qrImageUrl" alt="二维码" />
        <p class="qr-link">{{ inviteLink }}</p>
        <van-button size="small" type="primary" plain round block @click="copyInviteLink">复制链接</van-button>
      </div>
    </van-dialog>

    <!-- 关于 -->
    <van-dialog v-model:show="showAbout" title="关于狙击电竞" confirm-button-text="知道了">
      <div class="about-wrap">
        <p>版本 {{ appVersion }}</p>
        <p class="about-desc">租号交易平台 · 请在正规渠道下载使用</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showConfirmDialog, showToast, showDialog } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { getUserInfo, updateUserInfo, updateUserPassword } from '@/api/user';
import { logoutApi } from '@/api/auth';
import { uploadImageFile } from '@/api/upload';

const NOTIFICATION_KEY = 'setting_notification';
const DEFAULT_AVATAR = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg';

const router = useRouter();
const route = useRoute();

const appVersion = '1.2.0';
const notification = ref(true);
const cacheSize = ref('—');
const userInfo = ref({});

const showProfilePopup = ref(false);
const profileSaving = ref(false);
const avatarUploading = ref(false);
const profileForm = ref({
  username: '',
});

const showPasswordPopup = ref(false);
const passwordSaving = ref(false);
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const openGenderPicker = ref(false);
const genderColumns = [
  { text: '保密', value: 0 },
  { text: '男', value: 1 },
  { text: '女', value: 2 },
];
/** Picker 单列当前选中值 */
const genderPickerValues = ref([0]);

const showQrDialog = ref(false);
const showAbout = ref(false);

const displayAvatar = computed(() => {
  const u = userInfo.value.avatar || profileForm.value.avatar;
  return u || DEFAULT_AVATAR;
});

const displayNickname = computed(() => userInfo.value.username || userInfo.value.nickname || '未设置');

const genderLabel = computed(() => {
  const g = userInfo.value.gender;
  if (g === 1) return '男';
  if (g === 2) return '女';
  return '保密';
});

const inviteLink = computed(() => {
  const uid = userInfo.value.memberCode || userInfo.value.id || '';
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return uid ? `${base}/login?invite=${encodeURIComponent(String(uid))}` : `${base}/home`;
});

const qrImageUrl = computed(() => {
  const url = inviteLink.value;
  if (!url) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
});

const maskPhone = (phone) => {
  if (!phone || String(phone).length < 11) return phone;
  const p = String(phone);
  return `${p.slice(0, 3)}****${p.slice(7)}`;
};

const normalizeUser = (raw) => {
  if (!raw || typeof raw !== 'object') return {};
  return {
    ...raw,
    username: raw.username ?? raw.nickname ?? '',
    nickname: raw.nickname ?? raw.username ?? '',
    avatar: raw.avatar ?? raw.headImg ?? '',
    phone: raw.phone ?? raw.mobile ?? '',
    gender: raw.gender ?? 0,
    isRealAuth: Boolean(raw.isRealAuth ?? raw.realAuthFlag),
    id: raw.id,
    memberCode: raw.memberCode ?? raw.member_code,
  };
};

const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo();
    userInfo.value = normalizeUser(res?.data ?? res);
  } catch (e) {
    console.error(e);
    showToast('获取用户信息失败');
  }
};

const openProfileForm = () => {
  profileForm.value = {
    username: userInfo.value.username || userInfo.value.nickname || '',
  };
  showProfilePopup.value = true;
};

const afterReadAvatar = async (fileItem) => {
  const file = fileItem?.file;
  if (!file) return;
  avatarUploading.value = true;
  try {
    const res = await uploadImageFile(file);
    const url = res?.url || res?.data?.url;
    if (!url) {
      showToast('上传失败');
      return;
    }
    // 直接更新显示并在保存资料时提交
    userInfo.value.avatar = String(url);
    showToast('头像已上传');
  } catch (e) {
    showToast(e?.message || '上传失败');
  } finally {
    avatarUploading.value = false;
  }
};

const submitProfile = async () => {
  const name = (profileForm.value.username || '').trim();
  if (!name) {
    showToast('请填写昵称');
    return;
  }
  profileSaving.value = true;
  try {
    const payload = {
      username: name,
      gender: userInfo.value.gender ?? 0,
    };
    const av = (userInfo.value.avatar || '').trim();
    if (av) payload.avatar = av;
    await updateUserInfo(payload);
    showToast('保存成功');
    showProfilePopup.value = false;
    await fetchUserInfo();
    router.replace({ path: '/setting', query: { ...route.query, _ts: String(Date.now()) } });
  } catch (e) {
    showToast(e?.message || '保存失败');
  } finally {
    profileSaving.value = false;
  }
};

const openGenderCell = () => {
  genderPickerValues.value = [userInfo.value.gender ?? 0];
  openGenderPicker.value = true;
};

const onGenderConfirm = async ({ selectedValues }) => {
  const value = Number(selectedValues[0]);
  const genderVal = Number.isFinite(value) ? value : 0;
  openGenderPicker.value = false;
  try {
    const payload = {
      username: userInfo.value.username || userInfo.value.nickname,
      gender: genderVal,
    };
    const av = (userInfo.value.avatar || '').trim();
    if (av) payload.avatar = av;
    await updateUserInfo(payload);
    userInfo.value.gender = genderVal;
    showToast('已更新');
    await fetchUserInfo();
  } catch (e) {
    showToast(e?.message || '更新失败');
  }
};

const copyInviteLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    showToast('链接已复制');
  } catch {
    showToast('复制失败，请手动复制');
  }
};

const onChangePassword = () => {
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  showPasswordPopup.value = true;
};

const submitPassword = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm.value;
  if (!oldPassword || !newPassword) {
    showToast('请填写完整');
    return;
  }
  if (newPassword.length < 6) {
    showToast('新密码至少6位');
    return;
  }
  if (newPassword !== confirmPassword) {
    showToast('两次新密码不一致');
    return;
  }
  passwordSaving.value = true;
  try {
    await updateUserPassword({ oldPassword, newPassword });
    showToast('密码已修改，请重新登录');
    showPasswordPopup.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('satoken');
    router.replace('/login');
  } catch (e) {
    showToast(e?.message || '修改失败');
  } finally {
    passwordSaving.value = false;
  }
};

const onPhoneHint = () => {
  showToast('手机号用于登录与安全验证，换绑请联系客服');
};

const handleRealAuth = () => {
  router.push('/real-auth?from=setting');
};

const handleClearCache = () => {
  showConfirmDialog({
    title: '清除缓存',
    message: '将清除本地缓存数据（不包含登录状态）。确定继续？',
  })
    .then(() => {
      const keep = ['token', 'satoken', NOTIFICATION_KEY];
      const snapshot = {};
      keep.forEach((k) => {
        const v = localStorage.getItem(k);
        if (v != null) snapshot[k] = v;
      });
      localStorage.clear();
      Object.entries(snapshot).forEach(([k, v]) => localStorage.setItem(k, v));
      cacheSize.value = '0KB';
      showToast('清理完成');
    })
    .catch(() => {});
};

const persistNotification = (val) => {
  localStorage.setItem(NOTIFICATION_KEY, val ? '1' : '0');
};

const handleLogout = () => {
  showConfirmDialog({
    title: '退出提醒',
    message: '确定要退出登录吗？',
  })
    .then(async () => {
      try {
        await logoutApi();
      } catch {
        /* 仍本地退出 */
      }
      localStorage.removeItem('token');
      localStorage.removeItem('satoken');
      showToast('已安全退出');
      router.push('/login');
    })
    .catch(() => {});
};

onMounted(() => {
  const n = localStorage.getItem(NOTIFICATION_KEY);
  if (n === '0') notification.value = false;
  if (n === '1') notification.value = true;
  fetchUserInfo();
});

watch(
  () => route.query.refresh,
  (newVal) => {
    if (newVal === 'true') {
      fetchUserInfo();
      setTimeout(() => {
        router.replace({ path: '/setting', query: {} });
      }, 100);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.setting-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.setting-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px 0 40px;
}

.section-title {
  padding: 15px 16px 8px;
  font-size: 13px;
  color: #969799;
}

.logout-wrap {
  margin: 40px 16px 20px;
}

.footer-tips {
  text-align: center;
  font-size: 11px;
  color: #c8c9cc;
  margin-top: 20px;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}

.popup-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 0 8px;
}

.popup-actions .van-button {
  flex: 1;
}

.qr-wrap {
  padding: 16px;
  text-align: center;
}

.qr-hint {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px;
}

.qr-img {
  width: 160px;
  height: 160px;
  display: block;
  margin: 0 auto 12px;
}

.qr-link {
  font-size: 11px;
  color: #969799;
  word-break: break-all;
  margin-bottom: 12px;
}

.about-wrap {
  padding: 16px;
  text-align: center;
}

.about-desc {
  font-size: 12px;
  color: #969799;
  margin-top: 8px;
}

@media (min-width: 768px) {
  .mobile-nav-bar {
    display: none !important;
  }
}
@media (max-width: 767px) {
  .desktop-nav-bar {
    display: none !important;
  }
}
</style>
