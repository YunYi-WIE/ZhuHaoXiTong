<template>
  <div class="my-publish-page">
    <van-nav-bar
      title="我的发布"
      left-arrow
      @click-left="router.back()"
      fixed
      placeholder
      safe-area-inset-top
      z-index="999"
    />

    <main class="publish-container page-shell">
      <!-- 状态筛选 -->
      <div class="filter-section">
        <van-tabs v-model:active="activeStatus" @click-tab="handleStatusChange">
          <van-tab title="全部" name=""></van-tab>
          <van-tab title="审核中" name="2"></van-tab>
          <van-tab title="已上架" name="3"></van-tab>
          <van-tab title="已下架" name="1"></van-tab>
          <van-tab title="被驳回" name="5"></van-tab>
        </van-tabs>
      </div>

      <!-- 发布列表 -->
      <div class="publish-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              v-for="item in publishList"
              :key="item.id"
              class="publish-item"
              @click="viewDetail(item)"
            >
              <div class="item-header">
                <h4 class="item-title">{{ item.title || '未命名账号' }}</h4>
                <span class="item-status" :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
              </div>

              <div class="item-content">
                <div class="item-image">
                  <img :src="getFirstImage(item.images)" alt="账号封面" />
                </div>
                <div class="item-info">
                  <div class="info-row">
                    <span class="label">游戏大区：</span>
                    <span class="value">{{ item.gameRegion || '未知' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">出租单价：</span>
                    <span class="price">￥{{ item.price || 0 }}/小时</span>
                  </div>
                  <div class="info-row">
                    <span class="label">发布时间：</span>
                    <span class="time">{{ formatTime(item.createTime) }}</span>
                  </div>
                  <div v-if="item.status === 3 && item.listingExpireTime" class="info-row">
                    <span class="label">展示截止：</span>
                    <span class="time">{{ formatDateTime(item.listingExpireTime) }}</span>
                  </div>
                  <div v-if="item.status === 5" class="reject-reason">
                    <span class="label">驳回原因：</span>
                    <span class="value">{{ item.auditRejectReason || '—' }}</span>
                  </div>
                </div>
              </div>

              <div class="item-actions">
                <van-button
                  v-if="item.status === 3"
                  size="small"
                  type="default"
                  @click.stop="handleUnpublish(item)"
                >
                  下架
                </van-button>
                <van-button
                  v-else-if="item.status === 1 || item.status === 5"
                  size="small"
                  type="primary"
                  @click.stop="handlePublish(item)"
                >
                  提交审核
                </van-button>
                <van-button v-else-if="item.status === 2" size="small" disabled>
                  审核中
                </van-button>
                <van-button v-else-if="item.status === 4" size="small" disabled>
                  交易中
                </van-button>
                <van-button
                  size="small"
                  type="default"
                  plain
                  @click.stop="editItem(item)"
                  :disabled="!canEdit(item)"
                >
                  编辑
                </van-button>
                <van-button
                  size="small"
                  type="danger"
                  plain
                  @click.stop="deleteItem(item)"
                  :disabled="!canDelete(item)"
                >
                  删除
                </van-button>
              </div>
            </div>

            <div v-if="!loading && publishList.length === 0" class="empty-state">
              <van-empty description="暂无发布记录">
                <van-button round type="primary" @click="goToPublish">
                  去发布
                </van-button>
              </van-empty>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>

      <!-- 发布按钮 -->
      <div class="publish-action">
        <van-button
          round
          block
          type="primary"
          icon="plus"
          @click="goToPublish"
        >
          发布新账号
        </van-button>
      </div>
    </main>

    <!-- 操作确认对话框 -->
    <van-dialog
      v-model:show="showActionDialog"
      :title="actionDialogTitle"
      show-cancel-button
      @confirm="confirmAction"
    >
      <div class="dialog-content">
        {{ actionDialogMessage }}
      </div>
    </van-dialog>

    <van-dialog
      v-model:show="showListingRules"
      title="上架规则与上架费"
      show-cancel-button
      confirm-button-text="同意并提交审核"
      :before-close="onBeforeCloseListing"
    >
      <div class="listing-rules-body">
        <p class="listing-fee-hint">
          当前上架费：<b>¥{{ publishListingFeeLabel }}</b>（从钱包扣除）；审核通过后展示约 <b>{{ publishDurationHours }}</b> 小时，到期将自动下架符合条件的账号并退还上架费。
        </p>
        <ul class="rules-list">
          <li v-for="(line, idx) in publishRulesLines" :key="idx">{{ line }}</li>
        </ul>
        <van-checkbox v-model="agreeListingRules" shape="square" class="rules-check">
          我已阅读并同意上述规则
        </van-checkbox>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';
import { getMySjzAccountList, unpublishSjzAccount, publishSjzAccount, deleteSjzAccount, getSjzPublishRules } from '@/api/goods';
import { extractListRecords } from '@/utils/extractRecords';

const router = useRouter();

// 状态筛选
const activeStatus = ref('');
// 列表数据
const publishList = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

// 操作对话框
const showActionDialog = ref(false);
const actionDialogTitle = ref('');
const actionDialogMessage = ref('');
const currentAction = ref('');
const currentItem = ref(null);

const showListingRules = ref(false);
const publishRulesLines = ref([]);
const publishListingFeeLabel = ref('5');
const publishDurationHours = ref(72);
const agreeListingRules = ref(false);

// 状态文本映射
const statusMap = {
  // 后端 SjzAccount.status: 1-未发布, 2-待审核, 3-已上架, 4-交易中, 5-审核不通过, 6-已禁用
  1: { text: '已下架', class: 'status-unpublished' },
  2: { text: '审核中', class: 'status-review' },
  3: { text: '已上架', class: 'status-published' },
  4: { text: '交易中', class: 'status-trading' },
  5: { text: '被驳回', class: 'status-rejected' },
  6: { text: '已禁用', class: 'status-disabled' },
};

// 获取状态文本
const getStatusText = (status) => {
  return statusMap[status]?.text || '未知状态';
};

// 获取状态类名
const getStatusClass = (status) => {
  return statusMap[status]?.class || 'status-unknown';
};

const REGION_LABEL = {
  '310000': '微信区',
  '110000': 'QQ区',
};

// 获取第一张图片
const getFirstImage = (images) => {
  if (!images) return 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281';
  if (typeof images === 'string') {
    const imgArray = images.split(',');
    return imgArray[0] || 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281';
  }
  return 'https://img0.baidu.com/it/u=3023530335,2241577789&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281';
};

const regionText = (adcode) => {
  if (!adcode) return '未知';
  const s = String(adcode);
  return REGION_LABEL[s] || s;
};

// 格式化时间
const formatTime = (time) => {
  if (!time) return '';
  try {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN');
  } catch (e) {
    return time;
  }
};

const formatDateTime = (time) => {
  if (!time) return '';
  try {
    const date = new Date(time);
    return date.toLocaleString('zh-CN', { hour12: false });
  } catch (e) {
    return String(time);
  }
};

const canEdit = (item) => {
  // 体验优化：仅未发布/驳回允许编辑；审核中/上架/交易中/禁用不允许编辑
  return item?.status === 1 || item?.status === 5;
};

const canDelete = (item) => {
  // 体验优化：仅未发布/驳回允许删除
  return item?.status === 1 || item?.status === 5;
};

// 加载数据
const loadData = async (reset = false) => {
  loading.value = true;
  if (reset) {
    currentPage.value = 1;
    finished.value = false;
    publishList.value = [];
  }

  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
    };

    if (activeStatus.value !== '') {
      const st = parseInt(String(activeStatus.value), 10);
      if (Number.isFinite(st)) params.status = st;
    }

    const res = await getMySjzAccountList(params);
    console.log('我的发布列表响应:', res);

    const records = extractListRecords(res);

    // 格式化数据
    const formattedRecords = records.map(item => ({
      id: item.id,
      title: item.ratioInfo || item.title || item.accountCode || `账号 ${item.id}`,
      price: item.rent ?? item.price ?? 0,
      gameRegion: regionText(item.regionAdcode || item.gameRegion),
      status: item.status ?? 1,
      auditRejectReason: item.auditRejectReason || item.rejectReason || item.auditReason || '',
      listingExpireTime: item.listingExpireTime || item.listing_expire_time || '',
      images:
        item.warehouseScreenshot ||
        item.otherScreenshot ||
        item.banRecordScreenshot ||
        item.images ||
        '',
      createTime: item.createTime || item.publishTime || '',
    }));

    if (reset) {
      publishList.value = formattedRecords;
    } else {
      publishList.value = [...publishList.value, ...formattedRecords];
    }

    // 判断是否还有更多数据
    if (formattedRecords.length < pageSize.value) {
      finished.value = true;
    } else {
      currentPage.value += 1;
    }
  } catch (error) {
    console.error('加载我的发布列表失败:', error);
    showToast('加载失败，请稍后重试');
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true;
  loadData(true);
};

// 上拉加载
const onLoad = () => {
  if (!finished.value && !loading.value) {
    loadData(false);
  }
};

// 状态变更
const handleStatusChange = () => {
  loadData(true);
};

// 查看详情
const viewDetail = (item) => {
  if (item?.status !== 3) {
    showToast('仅已上架账号可进入详情页');
    return;
  }
  router.push(`/detail/${item.id}`);
};

// 编辑
const editItem = (item) => {
  if (!canEdit(item)) {
    showToast('当前状态不允许编辑');
    return;
  }
  router.push(`/publish?edit=${item.id}`);
};

// 删除
const deleteItem = (item) => {
  if (!canDelete(item)) {
    showToast('当前状态不允许删除');
    return;
  }
  currentItem.value = item;
  currentAction.value = 'delete';
  actionDialogTitle.value = '确认删除';
  actionDialogMessage.value = `确定要删除账号 "${item.title}" 吗？此操作不可恢复。`;
  showActionDialog.value = true;
};

// 上架：先展示规则与上架费，勾选同意后调用接口
const handlePublish = (item) => {
  currentItem.value = item;
  agreeListingRules.value = false;
  showListingRules.value = true;
};

// 下架
const handleUnpublish = (item) => {
  currentItem.value = item;
  currentAction.value = 'unpublish';
  actionDialogTitle.value = '确认下架';
  actionDialogMessage.value = `确定要将账号 "${item.title}" 下架吗？`;
  showActionDialog.value = true;
};

// 确认操作
const confirmAction = async () => {
  if (!currentItem.value) return;

  try {
    if (currentAction.value === 'delete') {
      await deleteSjzAccount(currentItem.value.id);
      showToast('删除成功');
    } else if (currentAction.value === 'unpublish') {
      await unpublishSjzAccount(currentItem.value.id);
      showToast('已下架');
    }

    // 刷新列表
    loadData(true);
  } catch (error) {
    console.error('操作失败:', error);
    const msg =
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.message ||
      '操作失败，请稍后重试';
    showToast(msg);
  } finally {
    currentItem.value = null;
    currentAction.value = '';
  }
};

const loadPublishRules = async () => {
  try {
    const data = await getSjzPublishRules();
    const text = data?.rulesText || '';
    publishRulesLines.value = text ? String(text).split('\n').filter(Boolean) : [];
    if (data?.listingFee != null && data?.listingFee !== '') {
      publishListingFeeLabel.value = String(data.listingFee);
    }
    if (data?.listingDurationHours != null) {
      publishDurationHours.value = Number(data.listingDurationHours) || 72;
    }
  } catch (e) {
    console.warn('publish-rules load failed', e);
    publishRulesLines.value = [
      '提交审核前将扣除上架费（具体金额以服务端配置为准）。',
      '体力、负重须达到平台最低要求。',
      '审核不通过或合规下架时，上架费将退回钱包余额（有订单或违规等情形以平台规则为准）。',
    ];
  }
};

/** @param {'confirm'|'cancel'} action */
const onBeforeCloseListing = async (action) => {
  if (action === 'cancel') return true;
  if (!agreeListingRules.value) {
    showToast('请勾选「已阅读并同意」');
    return false;
  }
  const item = currentItem.value;
  if (!item?.id) return true;
  try {
    await publishSjzAccount(item.id, { agreeListingRules: true });
    showToast('已提交审核');
    currentItem.value = null;
    loadData(true);
    return true;
  } catch (error) {
    console.error('提交审核失败:', error);
    const msg =
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.message ||
      '提交失败，请稍后重试';
    showToast(msg);
    return false;
  }
};

// 去发布页面
const goToPublish = () => {
  router.push('/publish');
};

// 初始化加载
onMounted(() => {
  loadPublishRules();
  loadData(true);
});
</script>

<style scoped>
.my-publish-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.publish-container {
  padding-top: 10px;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 80px; /* 为底部按钮留空间 */
}

.filter-section {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.publish-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  min-height: 300px;
}

.publish-item {
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.publish-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 8px;
}

.status-review {
  background: #fff3e0;
  color: #f57c00;
}

.status-published {
  background: #e8f5e8;
  color: #07c160;
}

.status-unpublished {
  background: #f5f5f5;
  color: #999;
}

.status-rejected {
  background: #ffebee;
  color: #ee0a24;
}

.status-trading {
  background: #e6f7ff;
  color: #1890ff;
}

.status-disabled {
  background: #f5f5f5;
  color: #999;
  text-decoration: line-through;
}

.status-unknown {
  background: #f5f5f5;
  color: #666;
}

.item-content {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.info-row {
  display: flex;
  margin-bottom: 6px;
  font-size: 13px;
}

.info-row .label {
  color: #666;
  min-width: 70px;
}

.info-row .value {
  color: #333;
  flex: 1;
}

.info-row .price {
  color: #ee0a24;
  font-weight: bold;
}

.info-row .time {
  color: #999;
}

.reject-reason {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fff1f0;
  color: #a8071a;
  font-size: 12px;
  line-height: 1.4;
  word-break: break-all;
}
.reject-reason .label {
  color: #a8071a;
  font-weight: 600;
  margin-right: 6px;
}

.item-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-state {
  padding: 40px 0;
}

.publish-action {
  position: fixed;
  bottom: 20px;
  left: 50%;
  width: min(600px, calc(100% - 2 * var(--page-pad-mobile)));
  transform: translateX(-50%);
}

@media (min-width: 768px) {
  .publish-action {
    width: min(600px, calc(100% - 2 * var(--page-pad-tablet)));
  }
}

@media (min-width: 1100px) {
  .publish-action {
    width: min(600px, calc(100% - 2 * var(--page-pad-desktop)));
  }
}

.listing-rules-body {
  padding: 12px 20px 20px;
  max-height: min(56vh, 400px);
  overflow-y: auto;
  text-align: left;
  font-size: 13px;
  color: #323233;
  line-height: 1.55;
}
.listing-fee-hint {
  margin: 0 0 10px;
  color: #646566;
}
.listing-fee-hint b {
  color: #ee0a24;
}
.rules-list {
  margin: 0 0 12px;
  padding-left: 18px;
}
.rules-list li {
  margin-bottom: 6px;
}
.rules-check {
  align-items: flex-start;
  line-height: 1.5;
}

.dialog-content {
  padding: 20px;
  text-align: center;
  font-size: 15px;
  color: #333;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .item-content {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 120px;
  }

  .item-actions {
    flex-wrap: wrap;
  }

  .item-actions .van-button {
    flex: 1;
    min-width: 80px;
  }
}
</style>