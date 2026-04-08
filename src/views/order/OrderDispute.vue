<template>
  <div class="dispute-page">
    <van-nav-bar
      title="售后/仲裁"
      left-arrow
      fixed
      placeholder
      safe-area-inset-top
      @click-left="router.back"
    />

    <div v-if="loading" class="state-wrap">
      <van-loading type="spinner" size="28">加载中…</van-loading>
    </div>

    <template v-else>
      <div class="order-card van-hairline--bottom">
        <p class="order-label">关联订单</p>
        <p class="order-no">{{ orderBrief.orderNo || orderBrief.id || '—' }}</p>
        <p class="order-title van-ellipsis">{{ orderBrief.title }}</p>
        <p class="order-meta">状态：{{ orderBrief.statusText }}</p>
      </div>

      <template v-if="hasExistingDispute">
        <van-cell-group inset title="已提交的投诉/仲裁">
          <van-cell title="事由" :label="disputeDetail.reason || '—'" />
          <van-cell
            v-if="disputeRefundValue != null && disputeRefundValue !== ''"
            title="退款"
            :value="'￥' + formatMoney(disputeRefundValue)"
          />
          <van-cell v-if="disputeDetail.evidenceImages" title="证据" :label="disputeDetail.evidenceImages" />
          <van-cell v-if="disputeStatusText" title="处理状态" :value="disputeStatusText" />
          <van-cell v-if="disputeDetail.createTime" title="发起时间" :value="String(disputeDetail.createTime)" />
        </van-cell-group>
        <p class="tips">请耐心等待客服处理，如需补充材料请联系官方客服。</p>
      </template>

      <template v-else>
        <van-form @submit="onSubmit">
          <van-cell-group inset title="发起售后/仲裁">
            <van-field
              v-model="form.reason"
              name="reason"
              label="投诉事由"
              type="textarea"
              rows="4"
              maxlength="500"
              show-word-limit
              placeholder="请说明问题，如：无法登录、描述不符、账号被封等"
              required
              :rules="[{ required: true, message: '请填写事由' }]"
            />
            <van-cell class="evidence-uploader-cell" title="证据图片" title-width="7.2em">
              <template #value>
                <van-uploader
                  v-model="evidenceImgs"
                  multiple
                  :max-count="6"
                  accept="image/*"
                  :after-read="afterReadEvidence"
                  preview-size="64px"
                />
              </template>
            </van-cell>
            <p class="evidence-tip">
              选填，最多 6 张；与服务端 OSS 配置一致时上传为公网链接，否则为压缩图。
            </p>
            <van-field
              v-model="form.refundAmount"
              name="refundAmount"
              label="退款"
              type="number"
              placeholder="选填，退款金额（元）"
            />
          </van-cell-group>
          <div class="submit-bar">
            <van-button round block type="primary" native-type="submit" :loading="submitting">
              提交申请
            </van-button>
          </div>
        </van-form>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import { getOrderDetail, getOrderDispute, createOrderDispute } from '@/api/order';
import {
  unwrapOrderPayload,
  getOrderGoodsTitle,
} from '@/utils/orderDisplay';
import { addDisputeOrderId } from '@/utils/disputeOrder';
import { ORDER_STATUS_ALLOW_CREATE_DISPUTE } from '@/config/orderDisputePolicy';
import { joinUploaderDataUrls } from '@/utils/publishPayload';
import { afterReadOssOrDataUrl } from '@/utils/ossVanUploader';

const router = useRouter();
const route = useRoute();

const orderId = computed(() => String(route.params.orderId || ''));

const loading = ref(true);
const submitting = ref(false);
const orderEntity = ref(null);
const disputeRaw = ref(null);

const form = ref({
  reason: '',
  refundAmount: '',
});

/** 投诉证据图（与发布页同一套 OSS / dataURL 逻辑） */
const evidenceImgs = ref([]);

const afterReadEvidence = afterReadOssOrDataUrl;

function unwrapDispute(d) {
  if (!d || typeof d !== 'object') return null;
  return d.data !== undefined ? d.data : d;
}

function formatMoney(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : String(v ?? '');
}

function orderStatusNum(o) {
  return Number(o?.status ?? o?.orderStatus);
}

function canCreateDisputeByStatus(st) {
  return (
    Number.isFinite(st) &&
    ORDER_STATUS_ALLOW_CREATE_DISPUTE.includes(Number(st))
  );
}

const orderBrief = computed(() => {
  const o = orderEntity.value;
  if (!o) {
    return { orderNo: '', id: '', title: '', statusText: '—' };
  }
  const st = o.status ?? o.orderStatus;
  const map = {
    0: '待付款',
    1: '租赁中',
    2: '已完成',
    3: '已取消',
  };
  return {
    orderNo: o.orderNo,
    id: o.id,
    title: getOrderGoodsTitle(o),
    statusText: map[st] ?? map[Number(st)] ?? '—',
  };
});

const disputeDetail = computed(() => unwrapDispute(disputeRaw.value) || {});

/** 展示用：兼容后端 refundAmount / requestedAmount */
const disputeRefundValue = computed(() => {
  const d = disputeDetail.value;
  const v = d.refundAmount ?? d.requestedAmount;
  if (v === undefined || v === null || v === '') return null;
  return v;
});

const hasExistingDispute = computed(() => {
  const d = disputeDetail.value;
  if (!d || typeof d !== 'object') return false;
  if (d.reason || d.id || d.disputeId) return true;
  const st = d.status ?? d.disputeStatus;
  return st !== undefined && st !== null && st !== '';
});

const disputeStatusText = computed(() => {
  const d = disputeDetail.value;
  const st = d.status ?? d.disputeStatus;
  if (st === 'pending' || st === 1 || st === '1') return '等待客服处理';
  if (st === 'processing' || st === 2 || st === '2') return '处理中';
  if (st === 'resolved' || st === 3 || st === '3') return '已完结';
  if (st === 'rejected' || st === 4 || st === '4') return '已驳回';
  if (typeof st === 'string' && st) return st;
  return '';
});

async function load() {
  loading.value = true;
  try {
    if (!orderId.value) {
      showToast('订单无效');
      router.back();
      return;
    }
    const [detailRes, disputeTry] = await Promise.allSettled([
      getOrderDetail(orderId.value),
      getOrderDispute(orderId.value),
    ]);

    if (detailRes.status === 'fulfilled') {
      orderEntity.value = unwrapOrderPayload(detailRes.value) || detailRes.value;
    } else {
      orderEntity.value = null;
      showToast('获取订单失败');
    }

    if (disputeTry.status === 'fulfilled') {
      disputeRaw.value = disputeTry.value;
    } else {
      disputeRaw.value = null;
    }

    const o = orderEntity.value;
    if (!o) {
      return;
    }
    const st = orderStatusNum(o);
    if (!canCreateDisputeByStatus(st)) {
      showToast(
        '当前订单状态不支持发起投诉（租赁中或已完成后可申请，具体以服务端校验为准）'
      );
      router.back();
    }
  } finally {
    loading.value = false;
  }
}

async function onSubmit() {
  if (!form.value.reason?.trim()) {
    showToast('请填写投诉事由');
    return;
  }
  if (evidenceImgs.value.some((f) => f.status === 'uploading' || f.status === 'failed')) {
    showToast('请等待证据图片上传完成或删掉失败项');
    return;
  }
  submitting.value = true;
  try {
    const raw = await getOrderDetail(orderId.value);
    const latest = unwrapOrderPayload(raw) || raw;
    orderEntity.value = latest;
    const st = orderStatusNum(latest);
    if (!canCreateDisputeByStatus(st)) {
      showToast('订单状态已变更，当前无法发起投诉');
      return;
    }

    const body = {
      reason: form.value.reason.trim(),
    };
    const ev = joinUploaderDataUrls(evidenceImgs.value).trim();
    if (ev) body.evidenceImages = ev;
    const amt = form.value.refundAmount?.trim();
    if (amt !== '' && amt != null) {
      const n = Number(amt);
      if (Number.isFinite(n) && n > 0) {
        body.requestedAmount = n;
      }
    }
    await createOrderDispute(orderId.value, body);
    addDisputeOrderId(orderId.value);
    showSuccessToast('提交成功');
    await load();
    form.value = { reason: '', refundAmount: '' };
    evidenceImgs.value = [];
  } catch (e) {
    console.error(e);
    showToast(e?.message || '提交失败');
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  load();
});
</script>

<style scoped>
.dispute-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 24px;
}
.state-wrap {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}
.order-card {
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;
}
.order-label {
  margin: 0;
  font-size: 12px;
  color: #969799;
}
.order-no {
  margin: 6px 0 4px;
  font-size: 13px;
  color: #646566;
}
.order-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}
.order-meta {
  margin: 0;
  font-size: 13px;
  color: #1989fa;
}
.tips {
  margin: 16px;
  font-size: 13px;
  color: #969799;
  line-height: 1.5;
}
.submit-bar {
  padding: 16px;
}
.evidence-uploader-cell :deep(.van-cell__value) {
  flex: 3;
  text-align: left;
}
.evidence-tip {
  margin: 0 16px 8px;
  font-size: 12px;
  color: #969799;
  line-height: 1.45;
}
</style>
