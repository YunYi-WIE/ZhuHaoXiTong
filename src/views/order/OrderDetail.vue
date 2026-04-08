<template>
  <div class="order-detail-page">
    <van-nav-bar
      title="订单详情"
      left-arrow
      fixed
      placeholder
      z-index="999"
      @click-left="router.back()"
    />

    <main v-if="loading" class="page-shell od-loading">
      <van-loading size="24px">加载中…</van-loading>
    </main>

    <main v-else-if="!order" class="page-shell od-empty">
      <van-empty description="订单不存在或无权查看" />
    </main>

    <main v-else class="page-shell od-main">
      <section class="od-card">
        <div class="od-head">
          <span class="od-no">{{ order.orderNo || order.id }}</span>
          <van-tag :type="statusTagType">{{ statusText }}</van-tag>
        </div>
        <p class="od-title van-ellipsis">{{ goodsTitle }}</p>
        <div class="od-row">
          <span class="k">应付/已付</span>
          <span class="v">￥{{ payAmountText }}</span>
        </div>
        <div class="od-row">
          <span class="k">租金 / 押金</span>
          <span class="v">￥{{ rentText }} / ￥{{ depositText }}</span>
        </div>
        <div class="od-row subtle">
          <span class="k">下单时间</span>
          <span class="v">{{ timeText }}</span>
        </div>
      </section>

      <section v-if="hasSettlement" class="od-card od-settlement">
        <h3 class="od-h3">结算明细</h3>
        <p class="od-tip">以下为订单完成时系统按档位费率与成交额减免计算后的结果。</p>
        <van-cell-group inset :border="false">
          <van-cell title="租赁方费用(从租金扣)" :value="'￥' + money(settlement?.buyerFeeAmount)" />
          <van-cell title="出租方费用(从租金扣)" :value="'￥' + money(settlement?.sellerFeeAmount)" />
          <van-cell title="平台补贴(卖家)" :value="'￥' + money(settlement?.subsidyAmount)" />
          <van-cell title="卖家实收(净)" :value="'￥' + money(settlement?.sellerPayoutAmount)" />
          <van-cell title="退还买家押金" :value="'￥' + money(settlement?.buyerRefundAmount)" />
          <van-cell title="平台净留存" :value="'￥' + money(settlement?.platformNetIncome)" title-class="cell-muted" />
        </van-cell-group>
      </section>

      <section v-else-if="order.status === 2" class="od-card od-muted">
        <p>暂无结算明细记录。若订单刚完成，请稍后下拉刷新；仍无显示请联系客服。</p>
      </section>

      <section v-else-if="order.status === 3" class="od-card od-muted">
        <p>订单已取消，不产生结算明细。</p>
      </section>

      <section v-else class="od-card od-muted">
        <p>
          结算将在订单<strong>正常完成</strong>后生成。费率与补贴与您的累计租赁时长、累计成交额（不含押金）相关，可在「我的」页查看<strong>租赁结算参考</strong>。
        </p>
      </section>

      <section class="od-actions">
        <van-button v-if="order.status === 0" block round type="primary" @click="goPay">去支付</van-button>
        <van-button v-if="order.status === 1 || order.status === 2" block round plain type="primary" @click="goAccount">
          查看账号
        </van-button>
        <van-button block round plain @click="router.push({ path: '/mine' })">租赁结算说明（个人中心）</van-button>
      </section>

      <section v-if="timelines.length" class="od-card">
        <h3 class="od-h3">订单动态</h3>
        <ul class="od-tl">
          <li v-for="(t, i) in timelines" :key="i" class="od-tl-item">
            <span class="od-tl-time">{{ formatTlTime(t) }}</span>
            <span class="od-tl-c">{{ t.content || t.remark || '—' }}</span>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { getOrderDetail } from '@/api/order';
import {
  unwrapOrderDetailBundle,
  getOrderGoodsTitle,
  getOrderPayAmount,
} from '@/utils/orderDisplay';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
/** @type {import('vue').Ref<Record<string, any> | null>} */
const order = ref(null);
const settlement = ref(null);
const timelines = ref([]);

const goodsTitle = computed(() => getOrderGoodsTitle(order.value));

const payAmountText = computed(() => {
  const n = getOrderPayAmount(order.value);
  return Number.isFinite(n) ? n.toFixed(2) : '—';
});

const rentText = computed(() => {
  const n = Number(order.value?.rentAmount ?? order.value?.rent ?? 0);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
});

const depositText = computed(() => {
  const n = Number(order.value?.depositAmount ?? order.value?.deposit ?? 0);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
});

const timeText = computed(() => {
  const t = order.value?.createTime ?? order.value?.createdAt;
  if (!t) return '—';
  const s = String(t);
  return s.includes('T') ? s.replace('T', ' ').slice(0, 19) : s;
});

const statusText = computed(() => {
  const m = { 0: '待付款', 1: '租赁中', 2: '已完成', 3: '已取消' };
  const s = order.value?.status;
  return m[s] ?? '—';
});

const statusTagType = computed(() => {
  const s = order.value?.status;
  if (s === 0) return 'warning';
  if (s === 1) return 'primary';
  if (s === 2) return 'success';
  return 'default';
});

const hasSettlement = computed(() => {
  if (order.value?.status !== 2) return false;
  const st = settlement.value;
  if (!st || typeof st !== 'object') return false;
  return Object.keys(st).some((k) => {
    const v = st[k];
    return v != null && v !== '';
  });
});

function money(v) {
  if (v == null || v === '') return '0.00';
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
}

function formatTlTime(t) {
  const x = t?.createTime ?? t?.time;
  if (!x) return '';
  const s = String(x);
  return s.includes('T') ? s.replace('T', ' ').slice(0, 16) : s;
}

function goPay() {
  const id = order.value?.id;
  if (!id) return;
  router.push({ path: '/pay', query: { orderId: String(id) } });
}

function goAccount() {
  const aid =
    order.value?.accountId ??
    order.value?.goodsId ??
    order.value?.sjzAccountId ??
    order.value?.account?.id;
  if (aid) {
    router.push(`/detail/${aid}`);
    return;
  }
  showToast('暂无关联账号');
}

async function load() {
  const id = route.params.id;
  if (!id) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const raw = await getOrderDetail(id);
    const bundle = unwrapOrderDetailBundle(raw);
    order.value = bundle.order;
    settlement.value = bundle.settlement;
    timelines.value = bundle.timelines || [];
  } catch (e) {
    console.error(e);
    showToast(e?.message || '加载失败');
    order.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  load();
});
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background: #f7f8fa;
}
.od-loading,
.od-empty {
  padding: 48px 16px;
  text-align: center;
}
.od-main {
  padding: 12px 12px 32px;
  max-width: 560px;
  margin: 0 auto;
}
.od-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}
.od-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.od-no {
  font-size: 12px;
  color: #969799;
}
.od-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #323233;
}
.od-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 6px;
}
.od-row.subtle {
  font-size: 12px;
  color: #969799;
}
.od-row .k {
  color: #646566;
}
.od-h3 {
  margin: 0 0 8px;
  font-size: 15px;
}
.od-tip {
  margin: 0 0 10px;
  font-size: 12px;
  color: #969799;
  line-height: 1.5;
}
.od-settlement :deep(.van-cell) {
  font-size: 13px;
}
.od-settlement :deep(.cell-muted) {
  color: #969799;
}
.od-muted {
  font-size: 13px;
  color: #646566;
  line-height: 1.6;
}
.od-muted strong {
  color: #323233;
}
.od-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.od-tl {
  list-style: none;
  margin: 0;
  padding: 0;
}
.od-tl-item {
  font-size: 12px;
  color: #646566;
  padding: 8px 0;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.od-tl-time {
  color: #969799;
}
.od-tl-c {
  white-space: pre-wrap;
  line-height: 1.45;
}
</style>
