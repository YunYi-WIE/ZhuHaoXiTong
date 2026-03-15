<template>
  <div class="after-sales-page">
    <van-nav-bar 
      title="售后/退款" 
      left-arrow 
      @click-left="onClickLeft"
      class="custom-nav"
      :border="false"
    />

    <div class="list-container">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="~ 仅展示近3个月的售后记录 ~"
        @load="onLoad"
      >
        <div v-for="item in afterSalesList" :key="item.id" class="as-card">
          <div class="card-header">
            <span class="as-no">售后单号：{{ item.asNo }}</span>
            <span :class="['as-status', item.statusClass]">{{ item.statusText }}</span>
          </div>
          
          <div class="card-body">
            <img :src="item.cover" class="goods-img" />
            <div class="goods-info">
              <h4 class="goods-title">{{ item.title }}</h4>
              <p class="as-reason">退款原因：{{ item.reason }}</p>
              <div class="as-price">退款金额：￥<b>{{ item.price }}</b></div>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-default" @click="contactSupport">详情/进度</button>
            <button class="btn-default">联系客服</button>
          </div>
        </div>
      </van-list>
      
      <div v-if="afterSalesList.length === 0 && !loading" class="empty-box">
        <van-icon name="description" size="64" color="rgba(255,255,255,0.3)" />
        <p>暂无相关售后记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const loading = ref(false);
const finished = ref(false);
const afterSalesList = ref([]);

const onClickLeft = () => {
  router.back();
};

const onLoad = () => {
  loading.value = true;
  setTimeout(() => {
    // 模拟售后数据
    const mockData = [
      {
        id: 1, asNo: 'AS88820260314', statusText: '退款成功', statusClass: 'status-green',
        title: '【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        reason: '密码错误且无法联系号主', price: '23.20'
      }
    ];
    afterSalesList.value.push(...mockData);
    loading.value = false;
    finished.value = true;
  }, 800);
};

const contactSupport = () => {
  showToast('正在查询详细进度...');
};
</script>

<style scoped>
/* 🚀 核心：全局紫蓝渐变背景 */
.after-sales-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 顶部导航透明化 */
:deep(.custom-nav) { background: transparent !important; }
:deep(.custom-nav .van-nav-bar__title), 
:deep(.custom-nav .van-icon) { color: #fff !important; font-weight: bold; }

.list-container { padding: 12px; }

/* 🚀 售后卡片 (首页同款白底风格) */
.as-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.card-header { display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 10px; margin-bottom: 12px; font-size: 12px; }
.as-no { color: #999; }
.as-status { font-weight: bold; }
.status-green { color: #07c160; }

.card-body { display: flex; gap: 12px; margin-bottom: 15px; }
.goods-img { width: 64px; height: 64px; border-radius: 6px; object-fit: cover; }
.goods-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.goods-title { margin: 0; font-size: 13px; color: #333; font-weight: bold; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
.as-reason { font-size: 12px; color: #ff3b30; margin: 4px 0; }
.as-price { font-size: 12px; color: #666; }
.as-price b { font-size: 16px; color: #333; }

.card-footer { display: flex; justify-content: flex-end; gap: 10px; }
.btn-default { padding: 5px 14px; border-radius: 15px; font-size: 12px; border: 1px solid #ddd; background: transparent; color: #666; }

/* 空状态 */
.empty-box { text-align: center; margin-top: 100px; color: rgba(255,255,255,0.6); }
.empty-box p { margin-top: 10px; font-size: 14px; }
</style>