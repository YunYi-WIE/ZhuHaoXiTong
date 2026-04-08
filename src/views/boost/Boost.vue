<template>
  <div class="boost">
    <van-nav-bar title="代肝服务" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="wrap">
      <van-notice-bar
        color="#3b82f6"
        background="#eff6ff"
        left-icon="info-o"
        text="下单并支付成功后，请添加客服微信对接具体需求与开刷时间。"
      />

      <div v-if="!loading && allServices.length" class="seg-wrap">
        <div class="seg" role="tablist">
          <button
            type="button"
            class="seg-item"
            :class="{ on: filterTab === 'all' }"
            role="tab"
            :aria-selected="filterTab === 'all'"
            @click="setFilterTab('all')"
          >
            全部
          </button>
          <button
            type="button"
            class="seg-item"
            :class="{ on: filterTab === 'coin' }"
            role="tab"
            :aria-selected="filterTab === 'coin'"
            @click="setFilterTab('coin')"
          >
            哈弗币
          </button>
          <button
            type="button"
            class="seg-item"
            :class="{ on: filterTab === 'box' }"
            role="tab"
            :aria-selected="filterTab === 'box'"
            @click="setFilterTab('box')"
          >
            安全箱
          </button>
        </div>
      </div>

      <van-skeleton v-if="loading" title :row="6" />

      <template v-else>
        <van-empty v-if="!serviceList.length" :description="emptyDesc" />

        <van-cell-group v-else inset>
          <van-cell
            v-for="s in serviceList"
            :key="String(s.id)"
            :title="s.title"
            :label="s.description || '下单后联系客服对接'"
            is-link
            @click="openOrderDialog(s)"
          >
            <template #value>
              <span class="price">￥{{ formatPrice(s.price) }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </template>
    </div>

    <van-dialog
      v-model:show="showDialog"
      :title="dialogTitle"
      show-cancel-button
      confirm-button-text="下单并去支付"
      @confirm="handleCreateOrder"
    >
      <div class="dlg">
        <div class="dlg-row">
          <span class="k">服务</span>
          <span class="v">{{ selected?.title || '—' }}</span>
        </div>
        <div class="dlg-row">
          <span class="k">金额</span>
          <span class="v price">￥{{ formatPrice(selected?.price) }}</span>
        </div>

        <van-field
          v-model="form.contact"
          label="微信号"
          placeholder="填写你的微信号，便于对接（可选）"
          maxlength="64"
        />
        <van-field
          v-model="form.remark"
          label="需求"
          type="textarea"
          placeholder="例如：哈弗币刷到多少/安全箱获取进度/可上号时间等（可选）"
          rows="3"
          maxlength="1000"
          show-word-limit
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showFailToast, showLoadingToast, closeToast } from 'vant';
import { getBoostServiceList, createBoostOrder } from '@/api/boost';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const allServices = ref([]);
const filterTab = ref('all');

const serviceList = computed(() => {
  const arr = allServices.value;
  if (filterTab.value === 'coin') {
    return arr.filter((s) => String(s.type || '').toLowerCase() === 'coin');
  }
  if (filterTab.value === 'box') {
    return arr.filter((s) => String(s.type || '').toLowerCase() === 'box');
  }
  return arr;
});

const emptyDesc = computed(() => {
  if (!allServices.value.length) return '暂无可用代肝服务';
  if (filterTab.value === 'coin') return '暂无哈弗币类代肝';
  if (filterTab.value === 'box') return '暂无安全箱类代肝';
  return '暂无可用代肝服务';
});

function tabFromRoute() {
  const t = String(route.query.type || '').toLowerCase();
  if (t === 'coin' || t === 'box') return t;
  return 'all';
}

function setFilterTab(tab) {
  filterTab.value = tab;
  if (tab === 'all') {
    router.replace({ path: '/boost' });
  } else {
    router.replace({ path: '/boost', query: { type: tab } });
  }
}

const showDialog = ref(false);
const selected = ref(null);
const form = reactive({ contact: '', remark: '' });

const dialogTitle = computed(() => (selected.value?.title ? `下单：${selected.value.title}` : '下单'));

function formatPrice(v) {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return '0.00';
  return n.toFixed(2);
}

function fallbackServices() {
  return [
    {
      id: 101,
      title: '哈弗币代肝',
      description: '哈弗币相关任务/跑图代刷，按单计费；支付后添加客服微信对接需求。',
      price: 199,
      type: 'coin',
      status: 1,
      sortOrder: 100,
    },
    {
      id: 102,
      title: '顶级安全箱代肝',
      description: '顶级安全箱获取代肝/代刷服务，按单计费；支付后添加客服微信对接。',
      price: 299,
      type: 'box',
      status: 1,
      sortOrder: 90,
    },
  ];
}

async function loadServices() {
  loading.value = true;
  try {
    const list = await getBoostServiceList();
    let arr = Array.isArray(list) ? list : [];
    if (!arr.length) {
      arr = fallbackServices();
    }
    allServices.value = arr;
  } catch (e) {
    console.warn(e);
    allServices.value = fallbackServices();
  } finally {
    loading.value = false;
  }
}

function openOrderDialog(service) {
  selected.value = service;
  form.contact = '';
  form.remark = '';
  showDialog.value = true;
}

async function handleCreateOrder() {
  if (!selected.value?.id) return;
  try {
    showLoadingToast({ message: '下单中…', forbidClick: true, duration: 0 });
    const order = await createBoostOrder({
      serviceId: selected.value.id,
      contact: form.contact,
      remark: form.remark,
    });
    closeToast();
    const orderId = order?.id;
    if (!orderId) {
      showFailToast('下单失败，请重试');
      return;
    }
    router.push({ path: '/boost/pay', query: { orderId: String(orderId) } });
  } catch (e) {
    closeToast();
    showFailToast(e?.message || '下单失败');
  }
}

watch(
  () => route.query.type,
  () => {
    filterTab.value = tabFromRoute();
  }
);

onMounted(() => {
  filterTab.value = tabFromRoute();
  loadServices();
});
</script>

<style scoped>
.boost {
  min-height: 100vh;
  background: #f7f8fa;
}
.wrap {
  padding: 12px 12px 24px;
  max-width: 520px;
  margin: 0 auto;
}
.seg-wrap {
  margin-bottom: 12px;
}
.seg {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #ebedf0;
  border-radius: 10px;
}
.seg-item {
  flex: 1;
  border: none;
  margin: 0;
  padding: 8px 6px;
  font-size: 13px;
  line-height: 1.2;
  color: #646566;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, font-weight 0.2s;
}
.seg-item.on {
  color: #323233;
  font-weight: 600;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.price {
  color: #ee0a24;
  font-weight: 700;
}
.dlg {
  padding: 6px 0 0;
}
.dlg-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  margin: 0 16px;
  font-size: 13px;
}
.dlg-row .k {
  color: #969799;
}
.dlg-row .v {
  color: #323233;
  font-weight: 600;
}
</style>

