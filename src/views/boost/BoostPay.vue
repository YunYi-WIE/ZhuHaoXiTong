<template>
  <div class="boost-pay">
    <van-nav-bar title="代肝支付" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="wrap page-shell">
      <section class="card">
        <p class="title">{{ order.serviceTitle || '代肝服务订单' }}</p>
        <div class="row">
          <span class="k">订单号</span>
          <span class="v mono">{{ order.orderNo || '—' }}</span>
        </div>
        <div class="row">
          <span class="k">应付金额</span>
          <span class="v price">￥{{ formatPrice(order.payAmount) }}</span>
        </div>
      </section>

      <section class="card">
        <h3 class="block-title">支付方式</h3>
        <van-radio-group v-model="payMethod">
          <van-cell-group :border="false" inset>
            <van-cell clickable class="pay-cell" :class="{ active: payMethod === 'balance' }" title="账户余额" :value="balanceText || ''" @click="payMethod = 'balance'">
              <template #icon>
                <van-icon name="gold-coin" class="ico ico-balance" />
              </template>
              <template #right-icon>
                <van-radio name="balance" checked-color="#ff976a" />
              </template>
            </van-cell>
            <van-cell clickable class="pay-cell" :class="{ active: payMethod === 'wechat' }" title="微信支付" @click="payMethod = 'wechat'">
              <template #icon>
                <van-icon name="wechat" class="ico ico-wechat" />
              </template>
              <template #right-icon>
                <van-radio name="wechat" checked-color="#07c160" />
              </template>
            </van-cell>
            <van-cell clickable class="pay-cell" :class="{ active: payMethod === 'alipay' }" title="支付宝" @click="payMethod = 'alipay'">
              <template #icon>
                <van-icon name="alipay" class="ico ico-alipay" />
              </template>
              <template #right-icon>
                <van-radio name="alipay" checked-color="#1677ff" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <p class="hint">支付成功后将提示添加客服微信对接。</p>
      </section>
    </div>

    <div class="bar safe-bottom">
      <van-button block round type="primary" class="btn" :disabled="!canPay" @click="handlePay">
        确认支付 ￥{{ formatPrice(order.payAmount) }}
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
        <p class="pay-qr-amount">￥{{ formatPrice(order.payAmount) }}</p>
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { closeToast, showConfirmDialog, showFailToast, showLoadingToast, showSuccessToast } from 'vant';
import useClipboard from 'vue-clipboard3';
import { getBoostOrderDetail, payBoostOrder } from '@/api/boost';
import { getWalletBalance } from '@/api/wallet';
import { parsePayOrderResult, qrContentToDataUrl } from '@/utils/payChannel';

const router = useRouter();
const route = useRoute();
const { toClipboard } = useClipboard();

const KefuWechatId = 'SniperAdmin_01';

const orderId = computed(() => String(route.query.orderId || ''));
const order = ref({});
const balanceText = ref('');
const payMethod = ref('balance');
const canPay = computed(() => !!orderId.value);

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

function formatPrice(v) {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return '0.00';
  return n.toFixed(2);
}

async function load() {
  if (!orderId.value) return;
  try {
    const [detailRes] = await Promise.all([
      getBoostOrderDetail(orderId.value),
      getWalletBalance()
        .then((d) => {
          const val = d?.availableBalance ?? d?.balance ?? d?.available ?? d?.amount ?? d;
          const n = Number(val ?? 0);
          balanceText.value = Number.isFinite(n) ? `可用￥${n.toFixed(2)}` : '';
        })
        .catch(() => {}),
    ]);
    order.value = detailRes || {};
  } catch (e) {
    console.error(e);
    showFailToast('获取订单失败');
  }
}

async function showKefuAfterPay() {
  await showConfirmDialog({
    title: '支付成功',
    message: `请添加客服微信：${KefuWechatId}\n\n我们将根据你的需求安排代肝，尽快与您对接。`,
    confirmButtonText: '复制微信号',
    cancelButtonText: '稍后',
  })
    .then(async () => {
      await toClipboard(KefuWechatId);
      showSuccessToast('已复制微信号');
    })
    .catch(() => {});
}

async function handlePay() {
  if (!orderId.value) return;
  try {
    showLoadingToast({ message: '支付中…', forbidClick: true, duration: 0 });
    const payRes = await payBoostOrder(orderId.value, { payMethod: payMethod.value });
    closeToast();
    if (payMethod.value === 'wechat' || payMethod.value === 'alipay') {
      const opened = await openQrFromPayRes(payRes);
      if (opened) return;
    }
    await showKefuAfterPay();
    router.replace({ path: '/mine' });
  } catch (e) {
    closeToast();
    showFailToast(e?.message || '支付失败');
  }
}

function onQrClosed() {
  stopPoll();
  qrImageSrc.value = '';
  qrLoading.value = false;
}

async function openQrFromPayRes(payRes) {
  const parsed = parsePayOrderResult(payRes);
  if (parsed.kind === 'qr_image') {
    qrImageSrc.value = parsed.imageSrc;
    showQrPopup.value = true;
    return true;
  }
  if (parsed.kind === 'qr_content') {
    showQrPopup.value = true;
    qrImageSrc.value = '';
    qrLoading.value = true;
    try {
      qrImageSrc.value = await qrContentToDataUrl(parsed.content);
      return true;
    } catch (e) {
      console.error(e);
      showQrPopup.value = false;
      showFailToast('生成二维码失败');
      return false;
    } finally {
      qrLoading.value = false;
    }
  }
  return false;
}

onMounted(() => {
  load();
});
</script>

<style scoped>
.boost-pay {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
}
.wrap {
  padding-top: 12px;
  padding-bottom: 24px;
  max-width: 520px;
  margin: 0 auto;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}
.title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  color: #323233;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 6px 0;
  font-size: 13px;
}
.k {
  color: #969799;
}
.v {
  color: #323233;
  font-weight: 600;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
.price {
  color: #ee0a24;
  font-weight: 800;
}
.block-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: #323233;
}
.pay-cell {
  border-radius: 10px;
}
.ico {
  font-size: 20px;
}
.ico-balance {
  color: #ff976a;
}
.ico-wechat {
  color: #07c160;
}
.ico-alipay {
  color: #1677ff;
}
.hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: #969799;
  line-height: 1.45;
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
.bar {
  position: fixed;
  left: 50%;
  bottom: 0;
  width: min(520px, calc(100% - 2 * var(--page-pad-mobile)));
  transform: translateX(-50%);
  padding: 12px 0 calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}
.btn {
  height: 44px;
  font-weight: 700;
}

@media (min-width: 768px) {
  .bar {
    width: min(520px, calc(100% - 2 * var(--page-pad-tablet)));
  }
}

@media (min-width: 1100px) {
  .bar {
    width: min(520px, calc(100% - 2 * var(--page-pad-desktop)));
  }
}
</style>

