<template>
  <div class="checkout">
    <van-nav-bar
      title="收银台"
      left-arrow
      fixed
      placeholder
      class="checkout-nav"
      @click-left="onClickLeft"
    />

    <div class="checkout-inner page-shell">
      <section v-if="countdownMs > 0" class="countdown-block">
        <p class="countdown-label">剩余支付时间</p>
        <van-count-down
          :time="countdownMs"
          format="mm : ss"
          class="countdown-digits"
          @finish="onTimerFinish"
        />
      </section>

      <section class="card amount-card">
        <p class="amount-label">应付金额（时租 × 时长 + 押金）</p>
        <div class="amount-main">
          <span class="currency">￥</span>
          <span class="value">{{ display.payAmount }}</span>
        </div>
        <p class="amount-formula">{{ display.formulaLine }}</p>
        <van-divider :style="{ margin: '12px 0', borderColor: '#ebedf0' }" />
        <div class="meta-row">
          <span class="k">时租</span>
          <span class="v">{{ display.hourlyText }}</span>
        </div>
        <div class="meta-row">
          <span class="k">时长</span>
          <span class="v">{{ display.hoursText }}</span>
        </div>
        <div class="meta-row">
          <span class="k">租金小计</span>
          <span class="v">{{ display.rentSubtotalText }}</span>
        </div>
        <div class="meta-row">
          <span class="k">押金</span>
          <span class="v">{{ display.depositText }}</span>
        </div>
      </section>

      <section class="card info-card">
        <p class="goods-title">{{ orderUi.title }}</p>
        <div class="meta-row subtle">
          <span class="k">订单编号</span>
          <span class="v mono">{{ orderUi.orderNo }}</span>
        </div>
      </section>

      <section class="card methods-card">
        <h3 class="block-title">支付方式</h3>
        <van-radio-group v-model="payMethod">
          <van-cell-group :border="false" inset>
            <van-cell clickable title="支付宝" class="pay-cell" @click="payMethod = 'alipay'">
              <template #icon>
                <van-icon name="alipay" class="ico ico-alipay" />
              </template>
              <template #right-icon>
                <van-radio name="alipay" checked-color="#1989fa" />
              </template>
            </van-cell>
            <van-cell clickable title="微信支付" class="pay-cell" @click="payMethod = 'wechat'">
              <template #icon>
                <van-icon name="wechat" class="ico ico-wechat" />
              </template>
              <template #right-icon>
                <van-radio name="wechat" checked-color="#07c160" />
              </template>
            </van-cell>
            <van-cell clickable class="pay-cell" @click="payMethod = 'balance'">
              <template #icon>
                <van-icon name="gold-coin" class="ico ico-balance" />
              </template>
              <template #title>
                <span>账户余额</span>
                <span v-if="balanceText" class="balance-hint">（可用 {{ balanceText }}）</span>
              </template>
              <template #right-icon>
                <van-radio name="balance" checked-color="#ff976a" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </section>

      <p v-if="payHintText" class="pay-channel-hint">{{ payHintText }}</p>

      <p class="fine-print settlement-link-tip">
        租金分成与手续费在订单<strong>完成结算</strong>时按平台规则计算；当前账号费率预览可在「我的」页「租赁结算参考」查看。
      </p>

      <p class="fine-print">
        说明：本页应付金额按「时租 × 租赁时长 + 押金」展示，与账号详情预估一致；实际扣款以服务端为准。
      </p>
    </div>

    <div class="checkout-bar safe-bottom">
      <van-button
        block
        round
        type="primary"
        class="submit-btn"
        :disabled="!canPay"
        @click="handleConfirmPay"
      >
        确认支付 ￥{{ display.payAmount }}
      </van-button>
    </div>

    <van-popup
      v-model:show="showQrPopup"
      round
      position="center"
      class="pay-qr-popup"
      :style="{ width: '85%', maxWidth: '320px' }"
      @closed="onQrClosed"
    >
      <div class="pay-qr-sheet">
        <p class="pay-qr-title">{{ payMethod === 'alipay' ? '支付宝扫码支付' : '微信扫码支付' }}</p>
        <p class="pay-qr-hint">请使用对应 App 扫描下方二维码完成支付</p>
        <p class="pay-qr-amount">￥{{ display.payAmount }}</p>
        <div class="pay-qr-img-wrap">
          <van-loading v-if="qrLoading" type="spinner" size="36" />
          <img v-else-if="qrImageSrc" :src="qrImageSrc" alt="支付二维码" class="pay-qr-img" />
        </div>
        <van-button block round type="default" @click="showQrPopup = false">关闭</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  showToast,
  showDialog,
  showLoadingToast,
  showSuccessToast,
  closeToast,
} from 'vant';
import { payOrder, getOrderDetail } from '@/api/order';
import { getWalletBalance } from '@/api/wallet';
import {
  getOrderGoodsTitle,
  unwrapOrderPayload,
  getPayRentTimesHoursBreakdown,
} from '@/utils/orderDisplay';
import { parsePayOrderResult, qrContentToDataUrl, isOrderPaid } from '@/utils/payChannel';
import { useSiteBrandingStore } from '@/stores/siteBranding';

const router = useRouter();
const branding = useSiteBrandingStore();

const payHintText = computed(() => (branding.payChannelHint || '').trim());
const route = useRoute();

const orderId = ref(String(route.query.orderId || ''));
const payMethod = ref('alipay');
const countdownMs = ref(15 * 60 * 1000);
const balanceText = ref('');

const orderRaw = ref(null);

const orderUi = ref({
  title: '—',
  orderNo: '—',
});

const breakdown = ref({
  hourly: NaN,
  hours: NaN,
  deposit: 0,
  rentSubtotal: 0,
  payAmount: 0,
  formulaLabel: '—',
});

const showQrPopup = ref(false);
const qrImageSrc = ref('');
const qrLoading = ref(false);
let pollTimer = null;

function stopPoll() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

onUnmounted(() => stopPoll());

const display = computed(() => {
  const b = breakdown.value;
  const payAmount =
    typeof b.payAmount === 'number' && Number.isFinite(b.payAmount)
      ? b.payAmount.toFixed(2)
      : '0.00';
  const hourlyText =
    Number.isFinite(b.hourly) && b.hourly >= 0
      ? `￥${b.hourly.toFixed(2)}/小时`
      : '—';
  const hoursText =
    Number.isFinite(b.hours) && b.hours > 0 ? `${b.hours} 小时` : '—';
  const dep = typeof b.deposit === 'number' && Number.isFinite(b.deposit) ? b.deposit : 0;
  const rentSub =
    typeof b.rentSubtotal === 'number' && Number.isFinite(b.rentSubtotal)
      ? b.rentSubtotal
      : NaN;
  return {
    payAmount,
    formulaLine: b.formulaLabel || '—',
    hourlyText,
    hoursText,
    depositText: dep > 0 ? `￥${dep.toFixed(2)}` : '免押金',
    rentSubtotalText:
      Number.isFinite(rentSub) && rentSub >= 0 ? `￥${rentSub.toFixed(2)}` : '—',
  };
});

const canPay = computed(() => {
  const p = breakdown.value.payAmount;
  return orderId.value && typeof p === 'number' && p > 0;
});

function formatBalancePayload(data) {
  if (!data || typeof data !== 'object') return '';
  const n = Number(
    data.balance ??
      data.availableBalance ??
      data.amount ??
      data.money ??
      NaN
  );
  if (!Number.isFinite(n)) return '';
  return `￥${n.toFixed(2)}`;
}

function resolveCountdownMs(order) {
  const end =
    order?.payDeadline ??
    order?.expireTime ??
    order?.paymentDeadline ??
    order?.closeTime;
  if (!end) return 15 * 60 * 1000;
  const ms = new Date(end).getTime() - Date.now();
  return Math.max(0, Math.min(ms, 24 * 60 * 60 * 1000));
}

async function afterPaidNavigate() {
  await branding.fetchBranding();
  if (branding.paySuccessPopupEnabled) {
    await showDialog({
      title: '支付成功',
      message:
        (branding.paySuccessNotice || '').trim() ||
        '您可在「我的订单」查看租赁进度；如需上号请联系客服。',
      confirmButtonText: '确定',
    });
  } else {
    showSuccessToast('支付成功');
  }
  router.replace({ path: '/order', query: { status: '1' } });
}

onMounted(async () => {
  branding.fetchBranding().catch(() => {});

  if (!orderId.value) {
    showToast('订单信息异常');
    router.back();
    return;
  }

  try {
    const [detailRes] = await Promise.all([
      getOrderDetail(orderId.value),
      getWalletBalance()
        .then((d) => {
          balanceText.value = formatBalancePayload(d);
        })
        .catch(() => {}),
    ]);

    const order = unwrapOrderPayload(detailRes) || detailRes;
    orderRaw.value = order;

    breakdown.value = getPayRentTimesHoursBreakdown(order);

    orderUi.value = {
      title: getOrderGoodsTitle(order),
      orderNo: order.orderNo || String(order.id ?? '—'),
    };

    countdownMs.value = resolveCountdownMs(order);
  } catch (e) {
    console.error(e);
    showToast('获取订单失败');
  }
});

const onClickLeft = () => router.back();

const onTimerFinish = () => {
  showDialog({ message: '支付超时，请重新下单' }).then(() => router.back());
};

function onQrClosed() {
  stopPoll();
  qrImageSrc.value = '';
  qrLoading.value = false;
}

async function tryFinishAfterPayResponse(payRes) {
  const parsed = parsePayOrderResult(payRes);
  if (parsed.kind === 'success') {
    await afterPaidNavigate();
    return true;
  }
  return false;
}

async function openQrFromPayRes(payRes) {
  const parsed = parsePayOrderResult(payRes);
  if (parsed.kind === 'qr_image') {
    qrImageSrc.value = parsed.imageSrc;
    showQrPopup.value = true;
    startPoll();
    return true;
  }
  if (parsed.kind === 'qr_content') {
    showQrPopup.value = true;
    qrImageSrc.value = '';
    qrLoading.value = true;
    try {
      qrImageSrc.value = await qrContentToDataUrl(parsed.content);
      startPoll();
      return true;
    } catch (e) {
      console.error(e);
      showQrPopup.value = false;
      showToast('生成二维码失败');
      return false;
    } finally {
      qrLoading.value = false;
    }
  }
  return false;
}

function startPoll() {
  stopPoll();
  const start = Date.now();
  const maxMs = 15 * 60 * 1000;
  pollTimer = setInterval(async () => {
    if (Date.now() - start > maxMs) {
      stopPoll();
      showQrPopup.value = false;
      showToast('等待支付超时，请稍后在订单里查看状态');
      return;
    }
    try {
      const detailRaw = await getOrderDetail(orderId.value);
      const order = unwrapOrderPayload(detailRaw) || detailRaw;
      if (isOrderPaid(order)) {
        stopPoll();
        showQrPopup.value = false;
        void afterPaidNavigate();
      }
    } catch (e) {
      console.error(e);
    }
  }, 2000);
}

const handleConfirmPay = async () => {
  if (!orderId.value || !canPay.value) {
    showToast('金额异常，请返回重试');
    return;
  }
  try {
    showLoadingToast({ message: '支付中…', forbidClick: true, duration: 0 });
    const payRes = await payOrder(orderId.value, { payMethod: payMethod.value });
    closeToast();

    if (await tryFinishAfterPayResponse(payRes)) {
      return;
    }

    if (payMethod.value === 'wechat' || payMethod.value === 'alipay') {
      const opened = await openQrFromPayRes(payRes);
      if (opened) return;
    }

    const detailRaw = await getOrderDetail(orderId.value);
    const order = unwrapOrderPayload(detailRaw) || detailRaw;
    if (isOrderPaid(order)) {
      await afterPaidNavigate();
      return;
    }

    if (payMethod.value === 'wechat' || payMethod.value === 'alipay') {
      showToast('未获取到支付二维码，请稍后重试');
      return;
    }
    showToast('支付未完成，请重试');
  } catch (err) {
    closeToast();
    console.error(err);
    showToast(err?.message || '支付失败');
  }
};
</script>

<style scoped>
.checkout {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
}

.checkout-inner {
  padding-top: 12px;
  padding-bottom: 24px;
  max-width: 480px;
  margin: 0 auto;
}

.checkout-nav :deep(.van-nav-bar) {
  background: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.countdown-block {
  text-align: center;
  padding: 16px 0 8px;
}
.countdown-label {
  margin: 0 0 8px;
  font-size: 13px;
  color: #969799;
}
.countdown-digits {
  font-size: 28px;
  font-weight: 700;
  color: #323233;
  letter-spacing: 0.02em;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.amount-card .amount-label {
  margin: 0 0 8px;
  font-size: 13px;
  color: #969799;
}
.amount-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  color: #ee0a24;
}
.amount-main .currency {
  font-size: 20px;
  font-weight: 700;
}
.amount-main .value {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.amount-formula {
  margin: 10px 0 0;
  text-align: center;
  font-size: 14px;
  color: #646566;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-top: 8px;
}
.meta-row:first-of-type {
  margin-top: 0;
}
.meta-row .k {
  color: #969799;
}
.meta-row .v {
  color: #323233;
  font-weight: 500;
}
.meta-row.subtle {
  margin-top: 10px;
}
.mono {
  font-size: 12px;
  word-break: break-all;
  text-align: right;
  max-width: 68%;
}

.info-card .goods-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  line-height: 1.4;
}

.methods-card .block-title {
  margin: 0 0 8px 4px;
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

.methods-card :deep(.van-cell-group--inset) {
  margin: 0;
}

.pay-cell :deep(.van-cell__title) {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ico {
  margin-right: 10px;
  font-size: 22px;
}
.ico-alipay {
  color: #1677ff;
}
.ico-wechat {
  color: #07c160;
}
.ico-balance {
  color: #ff976a;
}
.balance-hint {
  font-size: 12px;
  color: #969799;
  font-weight: 400;
  margin-left: 4px;
}

.pay-channel-hint {
  margin: 10px 4px 0;
  padding: 10px 12px;
  font-size: 12px;
  color: #646566;
  line-height: 1.55;
  background: #fff7e8;
  border-radius: 8px;
  border: 1px solid #ffe58f;
}

.fine-print {
  margin: 4px 4px 0;
  font-size: 11px;
  color: #c8c9cc;
  line-height: 1.5;
}

.checkout-bar {
  position: fixed;
  left: 50%;
  bottom: 0;
  width: min(680px, calc(100% - 2 * var(--page-pad-mobile)));
  transform: translateX(-50%);
  padding: 10px 0 calc(10px + env(safe-area-inset-bottom, 0px));
  background: #fff;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  z-index: 99;
}
.checkout-bar .submit-btn {
  font-weight: 600;
  height: 46px;
}

@media (min-width: 768px) {
  .checkout-inner {
    max-width: 680px;
    padding-top: 20px;
    padding-bottom: 32px;
  }
  .checkout-bar {
    width: min(680px, calc(100% - 2 * var(--page-pad-tablet)));
    border-radius: 12px 12px 0 0;
  }
}

@media (min-width: 1100px) {
  .checkout-bar {
    width: min(680px, calc(100% - 2 * var(--page-pad-desktop)));
  }
}

@media (max-width: 380px) {
  .checkout-inner {
    padding-top: 10px;
    padding-bottom: 20px;
  }
  .card {
    padding: 12px;
  }
  .amount-main .value {
    font-size: 34px;
  }
  .balance-hint {
    display: block;
    margin-left: 0;
    margin-top: 2px;
  }
  .pay-qr-popup {
    width: 92% !important;
  }
  .pay-qr-img-wrap {
    min-height: 200px;
  }
  .pay-qr-img {
    width: 200px;
    height: 200px;
  }
}

.pay-qr-sheet {
  padding: 20px 18px 16px;
  text-align: center;
}
.pay-qr-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 600;
  color: #323233;
}
.pay-qr-hint {
  margin: 0 0 8px;
  font-size: 13px;
  color: #969799;
  line-height: 1.4;
}
.pay-qr-amount {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  color: #ee0a24;
  font-variant-numeric: tabular-nums;
}
.pay-qr-img-wrap {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: #f7f8fa;
  border-radius: 10px;
}
.pay-qr-img {
  display: block;
  width: 240px;
  height: 240px;
  object-fit: contain;
}
</style>
