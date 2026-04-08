<template>
  <div class="mine-page">
    <NavBar activeMenu="mine" class="desktop-nav-bar" />

    <van-nav-bar 
      title="个人中心" 
      fixed 
      placeholder 
      z-index="999" 
      safe-area-inset-top 
      class="mobile-nav-bar"
    />

    <main class="mine-container page-shell">
      <div class="user-card">
        <div class="user-info">
          <van-image
            round
            width="64"
            height="64"
            :src="userInfo.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
          />
          <div class="user-text">
            <h2 class="nickname">{{ userInfo.username || '加载中...' }}</h2>
          </div>
          <van-icon name="setting-o" class="setting-icon" @click="router.push('/setting')" />
        </div>

        <div class="finance-grid">
          <div class="grid-item" @click="router.push('/wallet')">
            <span class="value">￥{{ walletData.balance?.toFixed(2) || '0.00' }}</span>
            <span class="label">账户余额</span>
          </div>
          <div class="grid-item">
            <span class="value">￥{{ walletData.frozenBalance?.toFixed(2) || '0.00' }}</span>
            <span class="label">冻结押金</span>
          </div>
          <div class="grid-item" @click="router.push('/my-publish')">
            <span class="value">{{ publishCount }}</span>
            <span class="label">我的发布</span>
          </div>
        </div>

        <div v-if="leaseStats" class="lease-stats-card">
          <div class="lease-stats-title">租赁结算参考</div>
          <div class="lease-row">
            <span class="k">累计租金成交(不含押)</span>
            <span class="v">￥{{ leaseVolText }}</span>
          </div>
          <div class="lease-row small">
            <span class="k">租客时长 / 号主时长</span>
            <span class="v">{{ leaseStats.buyerRentalHours ?? 0 }}h / {{ leaseStats.sellerRentalHours ?? 0 }}h</span>
          </div>
          <div class="lease-row small">
            <span class="k">下单位租赁方/出租方费率(参考)</span>
            <span class="v">{{ feePreviewText }}</span>
          </div>
          <div v-if="subsidyText" class="lease-row small">
            <span class="k">号主补贴(参考,元/天)</span>
            <span class="v">{{ subsidyText }}</span>
          </div>
          <div v-if="leaseStats.leaseVolumeDiscountPercentPoints > 0" class="lease-discount">
            当前已享成交额减免 {{ leaseStats.leaseVolumeDiscountPercentPoints }}% 手续费
          </div>
          <p v-if="leaseStats.leaseSettlementHint" class="lease-hint">{{ leaseStats.leaseSettlementHint }}</p>
        </div>
      </div>

      <div class="section-box">
        <div class="section-header">
          <span class="title">我的订单</span>
          <span class="more" @click="router.push({ path: '/order' })">
            查看全部 <van-icon name="arrow" />
          </span>
        </div>
        <van-grid :column-num="4" :border="false" class="order-grid">
          <van-grid-item icon="pending-payment" text="待付款" :badge="orderStats.pendingPayment" @click="router.push({ path: '/order', query: { status: 0 } })" />
          <van-grid-item icon="clock-o" text="租赁中" @click="router.push({ path: '/order', query: { status: 1 } })" />
          <van-grid-item icon="completed" text="已完成" @click="router.push({ path: '/order', query: { status: 2 } })" />
          <van-grid-item
            icon="warn-o"
            text="售后/仲裁"
            :badge="orderStats.afterSale > 0 ? orderStats.afterSale : undefined"
            @click="router.push({ path: '/order', query: { status: 'aftersale' } })"
          />
        </van-grid>
      </div>

      <div class="invite-banner" @click="showInvite = true">
        <div class="banner-content">
          <h3>邀请好友，每单赚 10% 佣金</h3>
          <p>好号共分享，奖金无上限</p>
        </div>
        <van-button size="small" round type="warning" class="invite-btn">立即邀请</van-button>
      </div>

      <div class="section-box list-box">
        <van-cell title="实名认证" is-link icon="shield-check-o" :value="userInfo.isRealAuth ? '已认证' : '未认证'" @click="handleRealName" />
        <van-cell title="官方客服" is-link icon="service-o" @click="showKefu = true" />
      </div>

      <div class="logout-wrap">
        <van-button block plain type="danger" class="logout-btn" @click="handleLogout">退出登录</van-button>
      </div>
    </main>

    <van-share-sheet
      v-model:show="showInvite"
      title="分享给好友，赚取租金抽成"
      :options="inviteOptions"
      @select="onInviteSelect"
    />

    <van-dialog v-model:show="showKefu" title="联系官方客服" show-cancel-button confirm-button-text="复制微信号" @confirm="copyWechat">
      <div class="kefu-content">
        <van-image width="120" height="120" src="https://fastly.jsdelivr.net/npm/@vant/assets/qrcode.png" />
        <p style="margin-top: 10px; color: #666; font-size: 13px;">工作时间：09:00 - 22:00</p>
        <p class="wechat-no">SniperAdmin_01</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';
import useClipboard from 'vue-clipboard3'; // 🚀 需安装：npm install vue-clipboard3
import NavBar from '@/components/NavBar.vue';
import { getUserInfo, getBalanceInfo } from '@/api/user';
import { getWalletBalance } from '@/api/wallet'; // 钱包余额API
import { logoutApi } from '@/api/auth';
import { getMySjzAccountList } from '@/api/goods';
import { getMyOrderList } from '@/api/order';
import { extractListRecords, extractPageTotal } from '@/utils/extractRecords';
import { getDisputeOrderIds, isAftersaleTabOrder } from '@/utils/disputeOrder';

const router = useRouter();
const route = useRoute();
const { toClipboard } = useClipboard();

const showKefu = ref(false);
const showInvite = ref(false);
const loading = ref(false);

const userInfo = ref({});
const walletData = ref({});
/** @type {import('vue').Ref<Record<string, any> | null>} */
const leaseStats = ref(null);
const publishCount = ref(0);

const leaseVolText = computed(() => {
  const n = Number(leaseStats.value?.leaseTradeVolume ?? 0);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
});

const feePreviewText = computed(() => {
  const b = leaseStats.value?.previewBuyerFeePercent;
  const s = leaseStats.value?.previewSellerFeePercent;
  const bn = b != null ? Number(b) : null;
  const sn = s != null ? Number(s) : null;
  if (bn == null || sn == null || !Number.isFinite(bn) || !Number.isFinite(sn)) return '—';
  return `${bn.toFixed(2)}% / ${sn.toFixed(2)}%`;
});

const subsidyText = computed(() => {
  const x = leaseStats.value?.leaseSubsidyYuanPerDay;
  const n = x != null ? Number(x) : NaN;
  return Number.isFinite(n) ? n.toFixed(2) : '';
});
const orderStats = ref({
  pendingPayment: 0,
  renting: 0,
  completed: 0,
  afterSale: 0
});

// 邀请分享配置
const inviteOptions = [
  { name: '微信', icon: 'wechat' },
  { name: '朋友圈', icon: 'wechat-moments' },
  { name: '复制链接', icon: 'link' },
  { name: '二维码', icon: 'qrcode' },
];

// 获取个人中心数据
const fetchData = async () => {
  loading.value = true;

  try {
    // 并行执行所有API请求，使用allSettled确保单个失败不影响其他
    const [walletResult, userResult, balanceInfoResult, publishResult, orderResult] = await Promise.allSettled([
      getWalletBalance(),
      getUserInfo(),
      getBalanceInfo(),
      getMySjzAccountList({ current: 1, size: 1 }),
      getMyOrderList({ current: 1, size: 100 })
    ]);

    // 处理钱包余额数据（优先使用钱包API，其次余额信息API，最后用户信息API）
    let walletBalance = 0;
    let walletFrozenBalance = 0;

    // 1. 尝试钱包API
    if (walletResult.status === 'fulfilled') {
      const walletResponse = walletResult.value;
      const walletDataRes = walletResponse.data || walletResponse;

      walletBalance = parseFloat(walletDataRes.balance || walletDataRes.availableBalance || 0) || 0;
      walletFrozenBalance = parseFloat(walletDataRes.frozenBalance || walletDataRes.depositBalance || 0) || 0;
    } else {
      // 2. 尝试余额信息API
      if (balanceInfoResult.status === 'fulfilled') {
        const balanceResponse = balanceInfoResult.value;
        const balanceData = balanceResponse.data || balanceResponse;

        walletBalance = parseFloat(balanceData.balance || balanceData.availableBalance || balanceData.totalBalance || 0) || 0;
        walletFrozenBalance = parseFloat(balanceData.frozenBalance || balanceData.depositBalance || 0) || 0;
      }
    }

    // 处理用户信息
    if (userResult.status === 'fulfilled') {
      const response = userResult.value;
      // API返回格式可能是 { data: userInfo, code, msg } 或直接是 userInfo
      const userData = response.data || response;
      userInfo.value = userData;

      // 如果钱包API和余额信息API都失败，则使用用户信息中的余额
      if (walletResult.status !== 'fulfilled' && balanceInfoResult.status !== 'fulfilled') {
        const balance = parseFloat(
          userData.balance ||
          userData.accountBalance ||
          userData.totalBalance ||
          0
        ) || 0;

        const frozenBalance = parseFloat(
          userData.frozenBalance ||
          userData.depositBalance ||
          0
        ) || 0;

        walletBalance = balance;
        walletFrozenBalance = frozenBalance;
      }
    } else {
      console.error('获取用户信息失败:', userResult.reason);
      showToast('用户信息加载失败');
    }

    // 设置最终的余额数据
    walletData.value = {
      balance: walletBalance,
      frozenBalance: walletFrozenBalance
    };

    if (balanceInfoResult.status === 'fulfilled') {
      const balanceResponse = balanceInfoResult.value;
      const balanceData = balanceResponse.data || balanceResponse;
      leaseStats.value = {
        leaseTradeVolume: balanceData.leaseTradeVolume,
        buyerRentalHours: balanceData.buyerRentalHours,
        sellerRentalHours: balanceData.sellerRentalHours,
        previewBuyerFeePercent: balanceData.previewBuyerFeePercent,
        previewSellerFeePercent: balanceData.previewSellerFeePercent,
        leaseSubsidyYuanPerDay: balanceData.leaseSubsidyYuanPerDay,
        leaseVolumeDiscountPercentPoints: balanceData.leaseVolumeDiscountPercentPoints ?? 0,
        leaseSettlementHint: balanceData.leaseSettlementHint,
      };
    } else {
      leaseStats.value = null;
    }

    // 处理我的发布数量
    if (publishResult.status === 'fulfilled') {
      const response = publishResult.value;
      const data = response?.data !== undefined ? response.data : response;
      publishCount.value = extractPageTotal(data);
    } else {
      console.error('获取我的发布失败:', publishResult.reason);
      publishCount.value = 0;
    }

    // 处理订单统计
    if (orderResult.status === 'fulfilled') {
      const response = orderResult.value;
      const data = response?.data !== undefined ? response.data : response;
      const orders = extractListRecords(data);
      orderStats.value = {
        pendingPayment: orders.filter((order) => order.status === 0).length,
        renting: orders.filter((order) => order.status === 1).length,
        completed: orders.filter((order) => order.status === 2).length,
        afterSale: 0,
      };
      try {
        const disRes = await getMyOrderList({
          current: 1,
          size: 200,
          hasDispute: 1,
        });
        const disRecords = extractListRecords(disRes).filter((o) =>
          isAftersaleTabOrder(o)
        );
        const badge = new Set(disRecords.map((o) => String(o.id)));
        getDisputeOrderIds().forEach((id) => badge.add(id));
        orderStats.value.afterSale = badge.size;
      } catch {
        orderStats.value.afterSale = getDisputeOrderIds().length;
      }
    } else {
      console.error('获取订单列表失败:', orderResult.reason);
      orderStats.value = {
        pendingPayment: 0,
        renting: 0,
        completed: 0,
        afterSale: getDisputeOrderIds().length,
      };
    }
  } catch (error) {
    console.error('获取个人中心数据失败:', error);
    showToast('数据加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

// 监听路由查询参数变化，当有刷新标志时重新获取数据
watch(
  () => route.query.refresh,
  (newVal) => {
    if (newVal === 'true') {
      fetchData();
      setTimeout(() => {
        router.replace({ path: '/mine', query: {} });
      }, 100);
    }
  },
  { immediate: true }
);

// 🚀 功能 1：复制用户 ID
const copyUserId = async (id) => {
  try {
    await toClipboard(id || userInfo.value.id?.toString() || '');
    showToast('ID 已复制到剪贴板');
  } catch (e) {
    showToast('复制失败');
  }
};

// 🚀 功能 2：复制客服微信
const copyWechat = async () => {
  try {
    await toClipboard('SniperAdmin_01');
    showToast('微信号已复制，请前往微信添加');
  } catch (e) {
    showToast('复制失败');
  }
};

// 🚀 功能 3：实名认证处理
const handleRealName = () => {
  // 如果已认证，显示当前认证信息并询问是否前往查看/修改
  if (userInfo.value.isRealAuth) {
    const realName = userInfo.value.realName || '';
    const maskedName = realName ? realName.charAt(0) + '*' + (realName.length > 1 ? realName.charAt(realName.length - 1) : '') : '';

    showConfirmDialog({
      title: '实名信息',
      message: `您已完成实名认证（${maskedName}），是否前往查看或修改认证信息？`,
      confirmButtonText: '前往查看',
      cancelButtonText: '取消'
    }).then(() => {
      router.push('/real-auth?from=mine');
    }).catch(() => {});
  } else {
    // 未认证，直接跳转到实名认证页面
    router.push('/real-auth?from=mine');
  }
};

// 邀请分享点击
const onInviteSelect = (option) => {
  showToast(`正在通过 ${option.name} 分享您的专属邀请链接...`);
  showInvite.value = false;
};

// 退出登录
const handleLogout = () => {
  showConfirmDialog({
    title: '退出提醒',
    message: '确认退出登录吗？',
  })
    .then(async () => {
      try {
        await logoutApi();
      } catch {
        /* 仍本地退出 */
      }
      localStorage.removeItem('token');
      localStorage.removeItem('satoken');
      showToast('已退出登录');
      router.push('/login');
    })
    .catch(() => {});
};
</script>

<style scoped>
/* 保持你原本优秀的 CSS，仅针对新增内容做微调 */
.mine-page { min-height: 100vh; background-color: #f7f8fa; padding-bottom: 80px; }
.mine-container { max-width: 760px; padding-top: 10px; padding-bottom: 10px; }

.user-card { background: linear-gradient(135deg, #1989fa 0%, #0d69c7 100%); border-radius: 16px; padding: 24px 20px; color: #fff; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(25, 137, 250, 0.2); }
.user-info { display: flex; align-items: center; position: relative; }
.user-text { margin-left: 15px; }
.user-text .nickname { margin: 0; font-size: 20px; font-weight: bold; }
.user-text .user-id { font-size: 13px; margin-top: 5px; opacity: 0.8; cursor: pointer; }
.copy-tag { background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 4px; margin-left: 5px; font-size: 11px; }
.setting-icon { position: absolute; right: 0; top: 0; font-size: 22px; cursor: pointer; }

.finance-grid { display: flex; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.grid-item { flex: 1; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
.grid-item .value { font-size: 17px; font-weight: bold; font-family: 'DIN Alternate', sans-serif; }
.grid-item .label { font-size: 12px; margin-top: 4px; opacity: 0.8; }

.lease-stats-card {
  margin-top: 16px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.45;
}
.lease-stats-title { font-weight: 600; font-size: 13px; margin-bottom: 8px; opacity: 0.95; }
.lease-row { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
.lease-row.small { opacity: 0.9; font-size: 11px; }
.lease-row .k { flex: 1; opacity: 0.85; }
.lease-row .v { font-weight: 600; text-align: right; }
.lease-discount { margin-top: 8px; color: #fff9c4; font-size: 11px; }
.lease-hint { margin: 10px 0 0; font-size: 10px; opacity: 0.75; line-height: 1.5; }

.section-box { background: #fff; border-radius: 12px; margin-bottom: 15px; overflow: hidden; }
.section-header { padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f5f5; }
.section-header .title { font-size: 15px; font-weight: bold; color: #333; }
.section-header .more { font-size: 12px; color: #999; cursor: pointer; }

.invite-banner { background: linear-gradient(to right, #fff9e6, #fff0c2); border-radius: 12px; padding: 15px 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #ffe58f; cursor: pointer; }
.invite-banner h3 { margin: 0; font-size: 15px; color: #856404; }
.invite-banner p { margin: 5px 0 0; font-size: 12px; color: #b58900; }

.kefu-content { padding: 20px; text-align: center; }
.wechat-no { font-weight: bold; color: #1989fa; font-size: 22px; margin-top: 10px; font-family: Courier, monospace; }

.logout-wrap { margin: 30px 16px; }
.logout-btn { border-radius: 8px; font-weight: bold; }

@media (min-width: 768px) {
  .mobile-nav-bar { display: none !important; }
}
@media (max-width: 767px) {
  .desktop-nav-bar { display: none !important; }
}
</style>