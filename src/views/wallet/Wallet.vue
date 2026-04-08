<template>
  <div class="wallet-page">
    <van-nav-bar
      title="我的钱包"
      fixed
      placeholder
      safe-area-inset-top
      left-arrow
      @click-left="router.back"
    />

    <main class="wallet-container page-shell">
      <!-- 余额卡片 -->
      <div class="balance-card">
        <div class="balance-info">
          <div class="balance-label">账户余额 (元)</div>
          <div class="balance-amount">￥{{ balance.toFixed(2) }}</div>
          <div class="balance-tips">可用余额，可直接用于支付订单</div>
        </div>
        <div class="balance-actions">
          <van-button type="primary" size="small" round @click="showRecharge = true">
            <van-icon name="cash-back-record" />
            充值
          </van-button>
          <van-button type="default" size="small" round @click="handleWithdraw">
            <van-icon name="cash-on-deliver" />
            提现
          </van-button>
        </div>
      </div>

      <!-- 钱包状态 -->
      <div class="wallet-status-card">
        <div class="status-header">
          <van-icon name="shield-check" class="status-icon" />
          <span class="status-title">钱包状态</span>
          <van-tag :type="walletActivated ? 'success' : 'danger'" size="medium">
            {{ walletActivated ? '已激活' : '未激活' }}
          </van-tag>
        </div>
        <div class="status-content">
          <p v-if="!walletActivated" class="status-desc">
            您的钱包尚未激活，激活后可进行提现操作。激活需要绑定银行卡。
          </p>
          <div v-else class="bank-info">
            <van-icon name="credit-pay" class="bank-icon" />
            <div class="bank-details">
              <div class="bank-name">{{ bankCard.bankName || '储蓄卡' }}</div>
              <div class="bank-number">**** **** **** {{ bankCard.lastFourDigits }}</div>
            </div>
          </div>
        </div>
        <van-button
          v-if="!walletActivated"
          type="primary"
          block
          plain
          size="small"
          @click="showActivateDialog = true"
        >
          激活钱包
        </van-button>
        <van-button
          v-else
          type="default"
          block
          plain
          size="small"
          @click="showBankManage = true"
        >
          管理银行卡
        </van-button>
      </div>

      <div v-if="leaseStats" class="lease-ref-card">
        <h3 class="section-title">租赁结算参考</h3>
        <p class="lease-ref-line">
          累计租金成交(不含押)：<b>￥{{ leaseVolText }}</b>
        </p>
        <p class="lease-ref-line small">
          租客/号主累计时长：{{ leaseStats.buyerRentalHours ?? 0 }}h / {{ leaseStats.sellerRentalHours ?? 0 }}h
        </p>
        <p v-if="feePreviewLine" class="lease-ref-line small">下单位参考费率：{{ feePreviewLine }}</p>
        <p v-if="subsidyLine" class="lease-ref-line small">号主补贴参考：{{ subsidyLine }} 元/天</p>
        <p v-if="leaseStats.leaseVolumeDiscountPercentPoints > 0" class="lease-discount-mini">
          已享成交额减免手续费 {{ leaseStats.leaseVolumeDiscountPercentPoints }}%
        </p>
        <p v-if="leaseStats.leaseSettlementHint" class="lease-ref-hint">{{ leaseStats.leaseSettlementHint }}</p>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <h3 class="section-title">快捷操作</h3>
        <van-cell title="实名认证" is-link icon="idcard" @click="router.push('/real-auth')" />
        <van-cell title="钱包帮助" is-link icon="question-o" @click="showHelp = true" />
      </div>

      <!-- 提现记录（后端 /api/withdraw/list） -->
      <div class="recent-transactions">
        <div class="section-header">
          <h3 class="section-title">提现记录</h3>
          <van-button size="mini" type="default" :loading="withdrawLoading" @click="fetchWithdrawList">刷新</van-button>
        </div>
        <div class="transaction-list">
          <van-cell v-for="tx in withdrawRecords" :key="tx.id">
            <template #title>
              <div class="tx-title">提现 ￥{{ tx.amountStr }}</div>
              <div class="tx-desc">{{ tx.statusText }}{{ tx.rejectReason ? ` · ${tx.rejectReason}` : '' }}</div>
            </template>
            <template #label>
              <div class="tx-time">{{ tx.timeStr }}</div>
            </template>
            <template #value>
              <van-tag :type="tx.statusTag" size="medium">{{ tx.statusShort }}</van-tag>
            </template>
          </van-cell>
          <div v-if="!withdrawLoading && withdrawRecords.length === 0" class="empty-tips">暂无提现记录</div>
        </div>
      </div>
    </main>

    <van-popup
      v-model:show="showRecharge"
      position="bottom"
      round
      :style="{ padding: '20px 20px 28px' }"
    >
      <h3 class="recharge-help-title">余额充值</h3>
      <p class="recharge-help-text">
        暂未开放自助在线充值。如需入账，请通过官方客服协商，或由管理后台为您的账号操作余额调整。
      </p>
      <van-button block round type="primary" class="recharge-help-btn" @click="contactForRecharge">
        联系客服
      </van-button>
      <van-button block round class="recharge-help-btn" @click="showRecharge = false">关闭</van-button>
    </van-popup>

    <van-popup v-model:show="showActivateDialog" position="bottom" round :style="{ padding: '16px 16px 24px' }">
      <div class="withdraw-popup">
        <h3 class="withdraw-popup__title">绑定银行卡</h3>
        <p class="withdraw-popup__hint">请先完成「实名认证」。打款至该本人储蓄卡。</p>
        <van-field
          v-model="bankCardNumber"
          type="digit"
          label="卡号"
          placeholder="本人储蓄卡卡号"
          maxlength="23"
        />
        <van-button block type="primary" round class="withdraw-popup__btn" :loading="bindCardSubmitting" @click="handleActivateWallet">
          确认绑定
        </van-button>
        <van-button block round class="withdraw-popup__btn" @click="showActivateDialog = false">取消</van-button>
      </div>
    </van-popup>

    <van-popup v-model:show="showWithdrawDialog" position="bottom" round :style="{ padding: '16px 16px 24px' }">
      <div class="withdraw-popup">
        <h3 class="withdraw-popup__title">余额提现</h3>
        <p class="withdraw-popup__hint">
          可用余额 <strong>￥{{ balance.toFixed(2) }}</strong>，提交后金额冻结；后台审核通过后打款，拒绝则退回余额。
        </p>
        <van-field
          v-model="withdrawAmount"
          type="number"
          label="金额"
          placeholder="最低 0.01 元"
          :formatter="formatAmount"
        >
          <template #button>
            <van-button size="small" type="primary" plain @click="withdrawAmount = balance.toFixed(2)">
              全部
            </van-button>
          </template>
        </van-field>
        <van-button
          block
          type="primary"
          round
          :loading="withdrawSubmitting"
          class="withdraw-popup__btn"
          @click="submitWithdraw"
        >
          确认提现
        </van-button>
      </div>
    </van-popup>

    <!-- 银行卡管理 -->
    <van-dialog
      v-model:show="showBankManage"
      title="银行卡"
      show-cancel-button
      confirm-button-text="更换银行卡"
      @confirm="openReplaceBank"
    >
      <div class="bank-manage-dialog">
        <div class="current-bank">
          <van-icon name="credit-pay" size="24" />
          <div class="bank-details">
            <div class="bank-name">{{ bankCard.bankName || '储蓄卡' }}</div>
            <div class="bank-number">**** **** **** {{ bankCard.lastFourDigits }}</div>
            <div class="bank-holder">持卡人：{{ bankCard.holderName }}</div>
          </div>
        </div>
        <p class="manage-tips">更换需验证新卡号，与实名信息一致</p>
      </div>
    </van-dialog>

    <!-- 帮助对话框 -->
    <van-dialog v-model:show="showHelp" title="钱包帮助" show-cancel-button confirm-button-text="我知道了">
      <div class="help-dialog">
        <h4>常见问题</h4>
        <p>1. 如何充值？</p>
        <p class="answer">请联系官方客服或管理员后台入账；入账后「账户余额」将更新。</p>
        <p>2. 提现需要多久？</p>
        <p class="answer">提交后运营审核；通过后 1～3 个工作日内打款至绑定银行卡。拒绝则全额退回余额。</p>
        <p>3. 如何提现？</p>
        <p class="answer">完成实名认证并绑定银行卡后，在钱包输入金额发起申请；审核中金额已从可用余额扣除。</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, showSuccessToast, closeToast } from 'vant';
import { openCustomerService } from '@/utils/customerService';
import { getWalletBalance, createWithdraw, getWithdrawList } from '@/api/wallet';
import { getBalanceInfo, getUserRealInfo, activateWallet } from '@/api/user';

const router = useRouter();

const balance = ref(0);
const walletActivated = ref(false);
const realInfoId = ref(null);

const bankCard = ref({
  bankName: '储蓄卡',
  lastFourDigits: '—',
  holderName: '—',
});

const showRecharge = ref(false);

const showActivateDialog = ref(false);
const bankCardNumber = ref('');

const showBankManage = ref(false);
const showHelp = ref(false);

const showWithdrawDialog = ref(false);
const withdrawAmount = ref('');
const withdrawSubmitting = ref(false);
const bindCardSubmitting = ref(false);
const withdrawLoading = ref(false);
/** @type {import('vue').Ref<Array<Record<string, any>>>} */
const withdrawRawList = ref([]);

/** @type {import('vue').Ref<Record<string, any> | null>} */
const leaseStats = ref(null);

const leaseVolText = computed(() => {
  const n = Number(leaseStats.value?.leaseTradeVolume ?? 0);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
});

const feePreviewLine = computed(() => {
  const b = leaseStats.value?.previewBuyerFeePercent;
  const s = leaseStats.value?.previewSellerFeePercent;
  const bn = b != null ? Number(b) : null;
  const sn = s != null ? Number(s) : null;
  if (bn == null || sn == null || !Number.isFinite(bn) || !Number.isFinite(sn)) return '';
  return `租赁方 ${bn.toFixed(2)}% · 出租方 ${sn.toFixed(2)}%`;
});

const subsidyLine = computed(() => {
  const x = leaseStats.value?.leaseSubsidyYuanPerDay;
  const n = x != null ? Number(x) : NaN;
  return Number.isFinite(n) ? n.toFixed(2) : '';
});

// 格式化金额输入
const formatAmount = (value) => {
  // 只保留数字和小数点
  return value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
};

function formatApiDateTime(v) {
  if (v == null || v === '') return '—';
  if (typeof v === 'string') {
    return v.replace('T', ' ').replace(/\.\d{3}Z?$/, '').slice(0, 19);
  }
  if (Array.isArray(v) && v.length >= 6) {
    const [y, mo, d, h, mi, s] = v;
    const pad = (n) => String(n).padStart(2, '0');
    return `${y}-${pad(mo)}-${pad(d)} ${pad(h)}:${pad(mi)}:${pad(s || 0)}`;
  }
  return String(v);
}

function maskName(name) {
  if (!name || typeof name !== 'string') return '—';
  const s = name.trim();
  if (s.length <= 1) return '*';
  return `${s[0]}*`;
}

const withdrawRecords = computed(() =>
  withdrawRawList.value.map((row) => {
    const st = Number(row.status);
    const map = {
      0: { short: '待审', text: '待审核', tag: 'warning' },
      1: { short: '已通过', text: '已通过，待打款', tag: 'success' },
      2: { short: '已拒绝', text: '已拒绝', tag: 'danger' },
    };
    const m = map[Number.isFinite(st) ? st : 0] || map[0];
    const amt = row.amount;
    const n = typeof amt === 'number' ? amt : parseFloat(String(amt));
    return {
      id: row.id,
      amountStr: Number.isFinite(n) ? n.toFixed(2) : String(amt ?? '0'),
      statusShort: m.short,
      statusText: m.text,
      statusTag: m.tag,
      rejectReason: row.rejectReason || '',
      timeStr: formatApiDateTime(row.createTime),
    };
  })
);

function contactForRecharge() {
  showRecharge.value = false;
  openCustomerService();
}

function handleWithdraw() {
  if (!realInfoId.value) {
    showToast('请先完成实名认证');
    router.push('/real-auth');
    return;
  }
  if (!walletActivated.value) {
    showToast('请先绑定银行卡');
    showActivateDialog.value = true;
    return;
  }
  withdrawAmount.value = balance.value > 0 ? balance.value.toFixed(2) : '';
  showWithdrawDialog.value = true;
}

async function submitWithdraw() {
  const n = parseFloat(String(withdrawAmount.value || '').replace(/,/g, ''));
  if (!Number.isFinite(n) || n < 0.01) {
    showToast('请输入至少 0.01 元');
    return;
  }
  if (n > balance.value + 1e-6) {
    showToast('不能超过可用余额');
    return;
  }
  withdrawSubmitting.value = true;
  showLoadingToast({ message: '提交中...', forbidClick: true });
  try {
    await createWithdraw({ amount: n });
    closeToast();
    showSuccessToast('提现申请已提交');
    showWithdrawDialog.value = false;
    withdrawAmount.value = '';
    await Promise.all([fetchBalance(), fetchWithdrawList()]);
  } catch (e) {
    closeToast();
    showToast(e?.message || '提现失败');
  } finally {
    withdrawSubmitting.value = false;
  }
}

async function handleActivateWallet() {
  if (!realInfoId.value) {
    showToast('请先到「实名认证」填写身份信息');
    router.push('/real-auth');
    return;
  }
  const card = String(bankCardNumber.value || '').replace(/\s/g, '');
  if (card.length < 16) {
    showToast('请输入正确的银行卡号');
    return;
  }
  bindCardSubmitting.value = true;
  try {
    await activateWallet(realInfoId.value, { bankCard: card });
    showSuccessToast('绑定成功');
    bankCardNumber.value = '';
    showActivateDialog.value = false;
    await Promise.all([fetchRealInfo(), fetchBalance()]);
  } catch (e) {
    showToast(e?.message || '绑定失败');
  } finally {
    bindCardSubmitting.value = false;
  }
}

function openReplaceBank() {
  showBankManage.value = false;
  bankCardNumber.value = '';
  showActivateDialog.value = true;
}

async function fetchWithdrawList() {
  withdrawLoading.value = true;
  try {
    const res = await getWithdrawList({ current: 1, size: 20 });
    const records = res?.records || res?.list || [];
    withdrawRawList.value = Array.isArray(records) ? records : [];
  } catch {
    withdrawRawList.value = [];
  } finally {
    withdrawLoading.value = false;
  }
}

async function fetchRealInfo() {
  try {
    const raw = await getUserRealInfo();
    const d = raw && typeof raw === 'object' && 'data' in raw ? raw.data : raw;
    if (!d || d.id == null) {
      realInfoId.value = null;
      walletActivated.value = false;
      bankCard.value = { bankName: '储蓄卡', lastFourDigits: '—', holderName: '—' };
      return;
    }
    realInfoId.value = d.id;
    const card = (d.bankCard != null ? String(d.bankCard) : '').trim();
    bankCard.value = {
      bankName: '储蓄卡',
      lastFourDigits: card.length >= 4 ? card.slice(-4) : '—',
      holderName: maskName(d.realName),
    };
    walletActivated.value = card.length >= 16;
  } catch {
    realInfoId.value = null;
    walletActivated.value = false;
  }
}

// 获取钱包余额
const fetchBalance = async () => {
  try {
    const [walletResult, balanceInfoResult] = await Promise.allSettled([
      getWalletBalance(),
      getBalanceInfo()
    ]);

    let newBalance = 0;
    // 优先使用钱包API
    if (walletResult.status === 'fulfilled') {
      const walletResponse = walletResult.value;
      const walletData = walletResponse.data || walletResponse;
      console.log('钱包页面钱包API响应:', walletData);
      newBalance = parseFloat(walletData.balance || walletData.availableBalance || 0) || 0;
    } else {
      console.warn('钱包页面钱包API调用失败，尝试余额信息API:', walletResult.reason);
      if (balanceInfoResult.status === 'fulfilled') {
        const balanceResponse = balanceInfoResult.value;
        const balanceData = balanceResponse.data || balanceResponse;
        console.log('钱包页面余额信息API响应:', balanceData);
        newBalance = parseFloat(balanceData.balance || balanceData.availableBalance || balanceData.totalBalance || 0) || 0;
      } else {
        console.warn('钱包页面余额信息API也失败，使用默认值:', balanceInfoResult.reason);
      }
    }

    balance.value = newBalance;

    try {
      const balInfo = await getBalanceInfo();
      const d = balInfo?.data ?? balInfo;
      if (d && typeof d === 'object') {
        leaseStats.value = {
          leaseTradeVolume: d.leaseTradeVolume,
          buyerRentalHours: d.buyerRentalHours,
          sellerRentalHours: d.sellerRentalHours,
          previewBuyerFeePercent: d.previewBuyerFeePercent,
          previewSellerFeePercent: d.previewSellerFeePercent,
          leaseSubsidyYuanPerDay: d.leaseSubsidyYuanPerDay,
          leaseVolumeDiscountPercentPoints: d.leaseVolumeDiscountPercentPoints,
          leaseSettlementHint: d.leaseSettlementHint,
        };
      }
    } catch {
      leaseStats.value = null;
    }
  } catch (error) {
    console.error('获取钱包余额失败:', error);
  }
};

onMounted(() => {
  fetchRealInfo();
  fetchBalance();
  fetchWithdrawList();
});
</script>

<style scoped>
.wallet-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.wallet-container {
  padding-top: 10px;
  max-width: 600px;
  margin: 0 auto;
}

/* 余额卡片 */
.balance-card {
  background: linear-gradient(135deg, #1989fa 0%, #0d69c7 100%);
  border-radius: 16px;
  padding: 24px 20px;
  color: #fff;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(25, 137, 250, 0.2);
}

.balance-info {
  text-align: center;
  margin-bottom: 20px;
}

.balance-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.balance-amount {
  font-size: 36px;
  font-weight: bold;
  font-family: 'DIN Alternate', sans-serif;
  margin-bottom: 5px;
}

.balance-tips {
  font-size: 12px;
  opacity: 0.7;
}

.balance-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.balance-actions .van-button {
  padding: 0 20px;
  height: 36px;
}

.balance-actions .van-icon {
  margin-right: 5px;
  font-size: 16px;
}

/* 钱包状态卡片 */
.lease-ref-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.lease-ref-line {
  margin: 6px 0 0;
  font-size: 14px;
  color: #323233;
  line-height: 1.5;
}
.lease-ref-line.small {
  font-size: 12px;
  color: #646566;
}
.lease-ref-line b {
  color: #1989fa;
}
.lease-discount-mini {
  margin: 8px 0 0;
  font-size: 12px;
  color: #ee0a24;
}
.lease-ref-hint {
  margin: 10px 0 0;
  font-size: 11px;
  color: #969799;
  line-height: 1.5;
}

.wallet-status-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.status-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.status-icon {
  color: #1989fa;
  font-size: 18px;
  margin-right: 8px;
}

.status-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.status-content {
  margin-bottom: 15px;
}

.status-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.bank-info {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 8px;
}

.bank-icon {
  color: #07c160;
  font-size: 24px;
  margin-right: 12px;
}

.bank-details {
  flex: 1;
}

.bank-name {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.bank-number {
  font-size: 13px;
  color: #666;
  font-family: monospace;
}

/* 快捷操作 */
.quick-actions {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
}

/* 最近交易 */
.recent-transactions {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.section-header .section-title {
  margin-bottom: 0;
}

.withdraw-popup__title {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  color: #323233;
}
.withdraw-popup__hint {
  margin: 0 0 16px;
  font-size: 13px;
  color: #646566;
  line-height: 1.55;
}
.withdraw-popup__btn {
  margin-top: 16px;
}
.activate-tip {
  margin: 0 0 12px;
  font-size: 13px;
  color: #646566;
  line-height: 1.5;
}

.transaction-list {
  border-radius: 8px;
  overflow: hidden;
}

.tx-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.tx-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.tx-time {
  font-size: 11px;
  color: #999;
}

.tx-amount {
  font-size: 16px;
  font-weight: bold;
  font-family: 'DIN Alternate', sans-serif;
}

.income-amount {
  color: #07c160;
}

.expense-amount {
  color: #ee0a24;
}

.empty-tips {
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 14px;
}

.recharge-help-title {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 700;
  color: #323233;
  text-align: center;
}
.recharge-help-text {
  margin: 0 0 20px;
  font-size: 14px;
  color: #646566;
  line-height: 1.55;
}
.recharge-help-btn {
  margin-top: 10px;
}

/* 激活对话框 */
.activate-dialog {
  padding: 16px;
}

/* 银行卡管理对话框 */
.bank-manage-dialog {
  padding: 20px;
  text-align: center;
}

.current-bank {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f7f8fa;
  border-radius: 12px;
}

.manage-tips {
  font-size: 13px;
  color: #999;
  margin: 0;
}

/* 帮助对话框 */
.help-dialog {
  padding: 16px;
}

.help-dialog h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.help-dialog p {
  margin: 10px 0 5px 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.help-dialog .answer {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #666;
  font-weight: normal;
  padding-left: 10px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .balance-amount {
    font-size: 32px;
  }

  .balance-actions {
    flex-direction: column;
    gap: 10px;
  }

  .balance-actions .van-button {
    width: 100%;
  }
}
</style>