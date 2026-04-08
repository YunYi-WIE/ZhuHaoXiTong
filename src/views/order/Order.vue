<template>
  <div class="order-page">
    <NavBar activeMenu="mine" class="desktop-nav-bar" />

    <van-nav-bar
      title="我的订单"
      left-arrow
      @click-left="router.push('/mine')"
      fixed
      placeholder
      z-index="999"
      class="mobile-nav-bar"
    />

    <main class="order-container page-shell">
      <van-tabs v-model:active="activeTab" sticky offset-top="46px" color="#1989fa" @change="onTabChange">
        <van-tab title="全部" name="all" />
        <van-tab title="待付款" name="0" />
        <van-tab title="租赁中" name="1" />
        <van-tab title="已完成" name="2" />
        <van-tab title="售后/仲裁" name="aftersale" />
      </van-tabs>

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多订单了"
          @load="onLoad"
          class="order-list"
        >
          <van-empty
            v-if="!loading && filteredOrders.length === 0 && finished"
            :description="activeTab === 'aftersale' ? '暂无售后/仲裁订单' : '暂无订单'"
          />

          <div class="order-card" v-for="order in filteredOrders" :key="order.id">
            <div class="card-header">
              <span class="shop-name"><van-icon name="shop-o" /> 平台自营</span>
              <span class="status-text">{{ getStatusText(order.status) }}</span>
            </div>

            <div class="card-content" @click="goToDetail(order)">
              <van-image
                radius="8"
                width="80"
                height="80"
                fit="cover"
                :src="getCover(order) || 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'"
              />
              <div class="info">
                <h4 class="title van-ellipsis">{{ getTitle(order) }}</h4>
                <p class="desc">
                  租期：{{ formatOrderRent(order) }} | 订单号：{{ order.orderNo || order.id }}
                </p>
                <div class="price-row">
                  <span class="price">￥{{ formatOrderAmount(order) }}</span>
                  <span class="count">x1</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="time">下单时间：{{ formatOrderTime(order) }}</div>
              <div class="btns">
                <van-button
                  v-if="order.status === 0"
                  size="small"
                  round
                  type="primary"
                  @click.stop="goToPay(order.id)"
                >
                  去支付
                </van-button>
                <van-button
                  v-if="order.status === 1 || order.status === 2"
                  size="small"
                  round
                  @click.stop="goToDetail(order)"
                >
                  查看详情
                </van-button>
                <van-button
                  v-if="order.status === 1 || order.status === 2"
                  size="small"
                  round
                  type="primary"
                  plain
                  @click.stop="goMessage(order)"
                >
                  去群聊
                </van-button>
                <van-button
                  v-if="canCreateDispute(order)"
                  size="small"
                  round
                  type="warning"
                  plain
                  @click.stop="goToDispute(order.id)"
                >
                  售后/仲裁
                </van-button>
                <van-button
                  v-if="order.status === 1"
                  size="small"
                  round
                  type="success"
                  plain
                  @click.stop="handleFinish(order)"
                >
                  发起结账
                </van-button>
                <van-button
                  v-if="order.status === 0"
                  size="small"
                  round
                  plain
                  type="danger"
                  @click.stop="handleCancel(order)"
                >
                  取消订单
                </van-button>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { getMyOrderList, getOrderDetail, cancelOrder, finishOrder } from '@/api/order';
import { extractListRecords } from '@/utils/extractRecords';
import {
  getOrderPayAmount,
  getOrderRentLabel,
  getOrderGoodsTitle,
  getOrderCoverUrl,
  getOrderTimeText,
  unwrapOrderPayload,
} from '@/utils/orderDisplay';
import {
  getDisputeOrderIds,
  isAftersaleTabOrder,
  dedupeOrdersById,
} from '@/utils/disputeOrder';
import { ORDER_STATUS_ALLOW_CREATE_DISPUTE } from '@/config/orderDisputePolicy';

const router = useRouter();
const route = useRoute();

/** 与后端 OrderStatusEnum 一致：0待支付 1租赁中 2已完成 3已取消 */
const activeTab = ref('all');
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const filteredOrders = ref([]);
const pageParams = { current: 1, size: 10 };

const listStatusParam = () => {
  if (
    activeTab.value === 'all' ||
    activeTab.value === '' ||
    activeTab.value == null ||
    activeTab.value === 'aftersale'
  ) {
    return undefined;
  }
  const n = Number(activeTab.value);
  return Number.isFinite(n) ? n : undefined;
};

const sortOrdersByTimeDesc = (list) => {
  const t = (o) =>
    new Date(o.createTime ?? o.createdAt ?? o.orderTime ?? 0).getTime();
  return [...list].sort((a, b) => t(b) - t(a));
};

/** 售后/仲裁：仅已发起售后（hasDispute=1 + 列表字段过滤；首屏合并 session 中刚提交的订单） */
const loadAftersaleMerged = async (isRefresh) => {
  try {
    if (isRefresh) {
      pageParams.current = 1;
      finished.value = false;
    }

    const c = pageParams.current;
    const sz = pageParams.size;

    let rawList = [];
    try {
      const res = await getMyOrderList({
        current: c,
        size: sz,
        hasDispute: 1,
      });
      rawList = extractListRecords(res);
    } catch (e) {
      console.warn('[售后列表] 拉取失败，将尝试仅展示本地已申请订单', e);
    }

    const exhausted = rawList.length < sz;
    let records = rawList.filter((row) => isAftersaleTabOrder(row));

    if (isRefresh && c === 1) {
      const have = new Set(records.map((r) => String(r.id)));
      const missing = getDisputeOrderIds().filter((id) => !have.has(id)).slice(0, 25);
      const extras = [];
      for (const id of missing) {
        try {
          const raw = await getOrderDetail(id);
          const o = unwrapOrderPayload(raw) || raw;
          if (o && isAftersaleTabOrder(o)) extras.push(o);
        } catch (_) {
          /* 忽略单条失败 */
        }
      }
      records = sortOrdersByTimeDesc(dedupeOrdersById([...records, ...extras]));
    }

    if (isRefresh) {
      filteredOrders.value = records;
    } else {
      const existing = new Set(filteredOrders.value.map((o) => String(o.id)));
      const append = records.filter((o) => !existing.has(String(o.id)));
      filteredOrders.value = [...filteredOrders.value, ...append];
    }

    if (exhausted) {
      finished.value = true;
    } else {
      pageParams.current += 1;
    }
  } catch (err) {
    console.error(err);
    showToast('加载订单失败');
    finished.value = true;
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

const loadOrders = async (isRefresh) => {
  if (activeTab.value === 'aftersale') {
    return loadAftersaleMerged(isRefresh);
  }
  try {
    if (isRefresh) {
      pageParams.current = 1;
      finished.value = false;
    }

    const params = {
      current: pageParams.current,
      size: pageParams.size,
    };
    const st = listStatusParam();
    if (st !== undefined) params.status = st;

    const res = await getMyOrderList(params);
    const records = extractListRecords(res);

    if (isRefresh) {
      filteredOrders.value = records;
    } else {
      filteredOrders.value = [...filteredOrders.value, ...records];
    }

    if (!records.length || records.length < pageParams.size) {
      finished.value = true;
    } else {
      pageParams.current += 1;
    }
  } catch (err) {
    console.error(err);
    showToast('加载订单失败');
    finished.value = true;
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

const applyQueryTab = () => {
  const q = route.query.status;
  if (q === undefined || q === null || q === '') {
    activeTab.value = 'all';
    return;
  }
  const s = String(q);
  if (s === 'all') {
    activeTab.value = 'all';
    return;
  }
  if (s === 'aftersale') {
    activeTab.value = 'aftersale';
    return;
  }
  if (['0', '1', '2'].includes(s)) {
    activeTab.value = s;
    return;
  }
  activeTab.value = 'all';
};

onMounted(() => {
  applyQueryTab();
});

watch(
  () => route.query.status,
  () => {
    applyQueryTab();
    loadOrders(true);
  }
);

const onTabChange = () => {
  loading.value = true;
  loadOrders(true);
};

const onRefresh = () => {
  refreshing.value = true;
  loadOrders(true);
};

const onLoad = () => {
  if (finished.value) {
    loading.value = false;
    return;
  }
  loadOrders(false);
};

const getStatusText = (status) => {
  const map = {
    0: '待付款',
    1: '租赁中',
    2: '已完成',
    3: '已取消',
  };
  return map[status] ?? map[Number(status)] ?? '未知';
};

const getTitle = (order) => getOrderGoodsTitle(order);
const getCover = (order) => getOrderCoverUrl(order);
const formatOrderAmount = (order) => {
  const n = getOrderPayAmount(order);
  if (Number.isFinite(n) && n > 0) return n.toFixed(2);
  const fallback = Number(order.totalAmount ?? order.price ?? order.actualAmount ?? 0);
  return Number.isFinite(fallback) ? fallback.toFixed(2) : '0.00';
};
const formatOrderRent = (order) => getOrderRentLabel(order).label;
const formatOrderTime = (order) => {
  const t = getOrderTimeText(order);
  if (!t) return '—';
  return t.includes('T') ? t.replace('T', ' ').slice(0, 19) : t;
};

const goToPay = (id) => {
  router.push({ path: '/pay', query: { orderId: String(id) } });
};

const goToDispute = (id) => {
  router.push({ path: `/order/dispute/${id}` });
};

const goMessage = (order) => {
  const oid = order?.id;
  router.push({
    path: '/message',
    query: oid != null ? { orderId: String(oid) } : {},
  });
};

const canCreateDispute = (order) => {
  const st = Number(order?.status ?? order?.orderStatus);
  return (
    Number.isFinite(st) && ORDER_STATUS_ALLOW_CREATE_DISPUTE.includes(st)
  );
};

/** 待付去收银台；已付/完成/取消进入订单详情（含结算明细） */
const goToDetail = (order) => {
  if (order.status === 0) {
    goToPay(order.id);
    return;
  }
  router.push({ path: `/order/detail/${order.id}` });
};

const handleCancel = (order) => {
  showConfirmDialog({
    title: '取消订单',
    message: '确定取消该待付款订单？',
  })
    .then(async () => {
      try {
        await cancelOrder(order.id);
        showToast('已取消');
        loadOrders(true);
      } catch (e) {
        showToast(e?.message || '取消失败');
      }
    })
    .catch(() => {});
};

const handleFinish = (order) => {
  showConfirmDialog({
    title: '确认完成',
    message: '确认租赁已结束？订单将设为已完成（具体以服务端处理为准）。',
  })
    .then(async () => {
      try {
        await finishOrder(order.id);
        showToast('操作成功');
        loadOrders(true);
      } catch (e) {
        showToast(e?.message || '操作失败');
      }
    })
    .catch(() => {});
};
</script>

<style scoped>
.order-page { min-height: 100vh; background-color: #f7f8fa; padding-bottom: 20px; }
.order-container { max-width: 760px; }
.order-list { padding: 12px; }
.order-card { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 13px; }
.shop-name { font-weight: bold; color: #333; }
.status-text { color: #ee0a24; font-weight: bold; }
.card-content { display: flex; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #f5f5f5; }
.info { flex: 1; min-width: 0; }
.info .title { margin: 0; font-size: 14px; color: #333; }
.info .desc { font-size: 12px; color: #999; margin: 4px 0; }
.price-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.price { color: #333; font-weight: bold; font-size: 15px; }
.count { color: #999; font-size: 12px; }
.card-footer { padding-top: 12px; }
.card-footer .time { font-size: 11px; color: #bbb; margin-bottom: 10px; }
.btns { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }

@media (min-width: 768px) { .mobile-nav-bar { display: none !important; } }
@media (max-width: 767px) { .desktop-nav-bar { display: none !important; } }
</style>
