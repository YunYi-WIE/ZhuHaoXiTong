<template>
  <div class="message-page">
    <NavBar activeMenu="message" class="desktop-nav-bar" />

    <van-nav-bar 
      title="消息中心" 
      fixed 
      placeholder 
      z-index="999" 
      safe-area-inset-top 
      class="mobile-nav-bar"
    />

    <main class="message-container page-shell">
      <van-tabs v-model:active="activeTab" sticky offset-top="46px" color="#1989fa" swipeable>
        
        <van-tab title="系统通知" name="system">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多通知了" @load="onLoad" class="msg-list">
              <div class="msg-card" v-for="item in systemMessages" :key="item.id" @click="openDetail(item)">
                <van-badge :dot="!item.isRead" class="badge-wrap">
                  <div class="msg-icon bg-blue"><van-icon name="volume-o" /></div>
                </van-badge>
                <div class="msg-info">
                  <div class="msg-header">
                    <span class="title">{{ item.title }}</span>
                    <span class="time">{{ item.time }}</span>
                  </div>
                  <div class="msg-content van-multi-ellipsis--l2">{{ item.content }}</div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>

        <van-tab title="交易动态" name="trade">
          <van-pull-refresh v-model="tradeRefreshing" @refresh="onTradeRefresh">
            <div class="msg-list">
              <div v-if="tradeLoading && tradeMessages.length === 0" class="msg-loading">
                <van-loading vertical>加载中</van-loading>
              </div>
              <template v-else>
                <div
                  class="msg-card"
                  v-for="item in tradeMessages"
                  :key="item.id"
                  @click="openDetail(item)"
                >
                  <van-badge :dot="!item.isRead" class="badge-wrap">
                    <div class="msg-icon bg-orange"><van-icon name="balance-list-o" /></div>
                  </van-badge>
                  <div class="msg-info">
                    <div class="msg-header">
                      <span class="title">{{ item.title }}</span>
                      <span class="time">{{ item.time }}</span>
                    </div>
                    <div class="msg-content van-multi-ellipsis--l2">{{ item.content }}</div>
                    <div class="msg-action" @click.stop="goToOrderDetail(item)">
                      查看订单 <van-icon name="arrow" />
                    </div>
                  </div>
                </div>
                <van-empty v-if="!tradeLoading && tradeMessages.length === 0" description="暂无订单动态" />
              </template>
            </div>
          </van-pull-refresh>
        </van-tab>

        <van-tab title="仲裁售后" name="dispute">
          <van-pull-refresh v-model="disputeRefreshing" @refresh="onDisputeRefresh">
            <div class="msg-list">
              <div v-if="disputeLoading && disputeMessages.length === 0" class="msg-loading">
                <van-loading vertical>加载中</van-loading>
              </div>
              <template v-else>
                <div
                  class="msg-card"
                  v-for="item in disputeMessages"
                  :key="item.id"
                  @click="openDetail(item)"
                >
                  <van-badge :dot="!item.isRead" class="badge-wrap">
                    <div class="msg-icon bg-red"><van-icon name="warning-o" /></div>
                  </van-badge>
                  <div class="msg-info">
                    <div class="msg-header">
                      <span class="title text-warn">{{ item.title }}</span>
                      <span class="time">{{ item.time }}</span>
                    </div>
                    <div class="msg-content van-multi-ellipsis--l2">{{ item.content }}</div>
                    <div class="msg-action" @click.stop="goToDisputeDetail(item)">
                      仲裁/售后 <van-icon name="arrow" />
                    </div>
                  </div>
                </div>
                <van-empty v-if="!disputeLoading && disputeMessages.length === 0" description="暂无售后或仲裁订单" />
              </template>
            </div>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </main>

    <van-popup
      v-model:show="showDetail"
      position="right"
      class="detail-popup"
      z-index="2000"
    >
      <van-nav-bar
        title="消息详情"
        left-arrow
        @click-left="showDetail = false"
        fixed
        placeholder
      />
      <div class="detail-content" v-if="currentMsg">
        <div class="detail-card">
          <h2 class="detail-title" :class="{'text-red': currentMsg.type === 'dispute'}">
            {{ currentMsg.title }}
          </h2>
          <div class="detail-time">{{ currentMsg.time }}</div>
          <van-divider />
          <div class="detail-body" style="white-space: pre-wrap;">
            {{ currentMsg.content }}
          </div>
        </div>
        
        <div class="detail-action" v-if="currentMsg && currentMsg.orderId">
          <van-button block round type="primary" color="#1989fa" @click="goFromDetail">
            {{ currentMsg.type === 'dispute' ? '查看仲裁/售后' : '查看订单' }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { getSystemNoticeList } from '@/api/system-notice';
import { getMyOrderList } from '@/api/order';
import { extractListRecords } from '@/utils/extractRecords';
import { isAftersaleTabOrder } from '@/utils/disputeOrder';
import {
  getOrderGoodsTitle,
  getOrderPayAmount,
  unwrapOrderPayload,
} from '@/utils/orderDisplay';

const router = useRouter();
const route = useRoute();
const activeTab = ref('system');

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);

const showDetail = ref(false);
const currentMsg = ref(null);

const systemMessages = ref([]);

const tradeMessages = ref([]);
const tradeLoading = ref(false);
const tradeRefreshing = ref(false);
const tradeFetched = ref(false);

const disputeMessages = ref([]);
const disputeLoading = ref(false);
const disputeRefreshing = ref(false);
const disputeFetched = ref(false);

const ORDER_STATUS_LABEL = {
  0: '待付款',
  1: '租赁中',
  2: '已完成',
  3: '已取消',
};

function orderStatusText(st) {
  const n = Number(st);
  return ORDER_STATUS_LABEL[n] ?? '订单';
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  } catch {
    return String(timestamp);
  }
}

async function loadSystemMessages(reset = false) {
  try {
    if (reset) {
      currentPage.value = 1;
      finished.value = false;
    }
    const res = await getSystemNoticeList({
      current: currentPage.value,
      size: pageSize.value,
    });
    const records = extractListRecords(res);
    const formattedData = records.map((item) => ({
      id: item.id,
      type: 'system',
      title: item.title || '无标题',
      content: item.content || '',
      time: item.createTime ? formatTime(item.createTime) : '未知时间',
      isRead: item.isRead || item.readStatus || false,
    }));
    if (reset) {
      systemMessages.value = formattedData;
    } else {
      systemMessages.value = [...systemMessages.value, ...formattedData];
    }
    if (formattedData.length < pageSize.value) {
      finished.value = true;
    } else {
      currentPage.value += 1;
    }
  } catch (e) {
    if (import.meta.env.DEV) console.warn('系统通知:', e);
    showToast(e?.message || '加载通知失败');
  } finally {
    loading.value = false;
    if (refreshing.value) refreshing.value = false;
  }
}

function buildTradeCard(o) {
  const id = o?.id;
  const title = getOrderGoodsTitle(o);
  const st = orderStatusText(o?.status ?? o?.orderStatus);
  const amt = getOrderPayAmount(o);
  const price =
    Number.isFinite(amt) && amt > 0 ? `￥${amt.toFixed(2)}` : (o.totalAmount != null ? `￥${Number(o.totalAmount).toFixed(2)}` : '—');
  return {
    id: `trade-${id}`,
    type: 'trade',
    orderId: id,
    title: `${st} · ${title || '租赁订单'}`,
    content: `订单号：${o.orderNo || id}\n应付：${price}`,
    time: formatTime(o.createTime ?? o.createdAt ?? o.orderTime),
    isRead: true,
  };
}

function buildDisputeCard(o) {
  const id = o?.id;
  const title = getOrderGoodsTitle(o);
  const st = orderStatusText(o?.status ?? o?.orderStatus);
  return {
    id: `dispute-${id}`,
    type: 'dispute',
    orderId: id,
    title: `售后/仲裁 · ${title || '租赁订单'}`,
    content: `订单号：${o.orderNo || id}，状态：${st}`,
    time: formatTime(o.createTime ?? o.createdAt ?? o.orderTime),
    isRead: true,
  };
}

async function loadTradeMessages() {
  tradeLoading.value = true;
  try {
    const res = await getMyOrderList({ current: 1, size: 40 });
    const records = extractListRecords(res);
    const sorted = [...records].sort((a, b) => {
      const ta = new Date(a?.createTime ?? a?.createdAt ?? 0).getTime();
      const tb = new Date(b?.createTime ?? b?.createdAt ?? 0).getTime();
      return tb - ta;
    });
    tradeMessages.value = sorted.map((row) => buildTradeCard(unwrapOrderPayload(row) || row));
    tradeFetched.value = true;
  } catch (e) {
    showToast(e?.message || '加载订单失败');
    tradeMessages.value = [];
  } finally {
    tradeLoading.value = false;
    tradeRefreshing.value = false;
  }
}

async function loadDisputeMessages() {
  disputeLoading.value = true;
  try {
    const res = await getMyOrderList({ current: 1, size: 80, hasDispute: 1 });
    const records = extractListRecords(res).filter((row) =>
      isAftersaleTabOrder(unwrapOrderPayload(row) || row)
    );
    const sorted = [...records].sort((a, b) => {
      const ta = new Date(a?.createTime ?? a?.createdAt ?? 0).getTime();
      const tb = new Date(b?.createTime ?? b?.createdAt ?? 0).getTime();
      return tb - ta;
    });
    disputeMessages.value = sorted.map((row) =>
      buildDisputeCard(unwrapOrderPayload(row) || row)
    );
    disputeFetched.value = true;
  } catch (e) {
    showToast(e?.message || '加载售后列表失败');
    disputeMessages.value = [];
  } finally {
    disputeLoading.value = false;
    disputeRefreshing.value = false;
  }
}

function onTradeRefresh() {
  void loadTradeMessages();
}

function onDisputeRefresh() {
  void loadDisputeMessages();
}

watch(activeTab, (name) => {
  if (name === 'trade' && !tradeFetched.value) void loadTradeMessages();
  if (name === 'dispute' && !disputeFetched.value) void loadDisputeMessages();
});

onMounted(() => {
  const oid = route.query.orderId;
  if (oid != null && String(oid).trim() !== '') {
    activeTab.value = 'trade';
    void loadTradeMessages();
  }
  loadSystemMessages(true);
});

const onRefresh = () => {
  loadSystemMessages(true);
};

const onLoad = () => {
  if (!finished.value) {
    loadSystemMessages(false);
  }
};

const openDetail = (item) => {
  currentMsg.value = item;
  showDetail.value = true;
  if (!item.isRead) {
    item.isRead = true;
  }
};

function goToOrderDetail(item) {
  const id = item?.orderId;
  if (id == null) return;
  router.push({ path: `/order/detail/${id}` });
}

function goToDisputeDetail(item) {
  const id = item?.orderId;
  if (id == null) return;
  router.push({ path: `/order/dispute/${id}` });
}

function goFromDetail() {
  const m = currentMsg.value;
  showDetail.value = false;
  if (!m?.orderId) return;
  if (m.type === 'dispute') {
    router.push({ path: `/order/dispute/${m.orderId}` });
  } else {
    router.push({ path: `/order/detail/${m.orderId}` });
  }
}
</script>

<style scoped>
.message-page { min-height: 100vh; background-color: #f7f8fa; padding-bottom: 60px; }
.message-container { max-width: 600px; margin: 0 auto; }
.msg-list { padding: 12px; }
.msg-card { display: flex; gap: 15px; background: #fff; padding: 16px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: background-color 0.2s; cursor: pointer; }
.msg-card:active { background: #f2f3f5; }
.msg-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #fff; }
.bg-blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.bg-orange { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.bg-red { background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%); }
.msg-info { flex: 1; min-width: 0; }
.msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.msg-header .title { font-size: 15px; font-weight: bold; color: #333; }
.msg-header .time { font-size: 12px; color: #999; }
.msg-content { font-size: 13px; color: #666; line-height: 1.5; }
.msg-action { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #eee; font-size: 13px; color: #1989fa; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }

.msg-loading { padding: 48px 0; display: flex; justify-content: center; }
.text-warn { color: #ee0a24 !important; }
.detail-action { margin-top: 20px; padding: 0 15px 24px; }

/* 详情弹窗基础样式 */
.detail-popup { width: 100%; height: 100%; background: #f7f8fa; }
.detail-content { padding: 15px; max-width: 800px; margin: 0 auto; }
.detail-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
.detail-title { font-size: 18px; color: #333; margin: 0 0 10px 0; line-height: 1.4; font-weight: bold; }
.detail-body { font-size: 15px; color: #444; line-height: 1.8; margin-top: 10px; }

/* 🚀 PC 端适配优化 */
@media (min-width: 768px) {
  .mobile-nav-bar { display: none !important; }
  
  /* 调整 PC 端弹窗宽度和居中显示 */
  .detail-popup {
    width: 600px !important; /* 限制宽度 */
    height: 80vh !important; /* 限制高度，不一定要全屏 */
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important; /* 居中 */
    border-radius: 16px; /* 增加圆角感 */
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
}

@media (max-width: 767px) {
  .desktop-nav-bar { display: none !important; }
}
</style>