<template>
  <div class="order-page">
    <van-nav-bar title="我的订单" fixed placeholder />
    
    <van-tabs v-model:active="activeTab" sticky offset-top="46" color="#ee0a24">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待付款" name="pending"></van-tab>
      <van-tab title="租赁中" name="renting"></van-tab>
      <van-tab title="已完成" name="finished"></van-tab>
    </van-tabs>

    <div class="list-container">
      <van-empty v-if="orderList.length === 0" description="暂无订单数据" />
      
      <div v-else class="order-item" v-for="item in orderList" :key="item.id">
        <div class="order-header">
          <span class="order-no">订单号：{{ item.orderNo }}</span>
          <span class="status-text" :class="item.status">{{ getStatusText(item.status) }}</span>
        </div>
        
        <AccountCard :item="item.accountInfo" />
        
        <div class="order-footer">
          <div class="total">实付款：<span>￥{{ item.totalPrice }}</span></div>
          <div class="actions">
            <van-button v-if="item.status === 'pending'" size="small" type="danger" plain round>去支付</van-button>
            <van-button v-if="item.status === 'renting'" size="small" type="primary" plain round>获取密码</van-button>
            <van-button v-if="item.status === 'finished'" size="small" type="default" round>删除订单</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AccountCard from '@/components/AccountCard.vue';

const activeTab = ref('all');

// 模拟订单数据
const orderList = ref([
  {
    id: 1,
    orderNo: 'RN202310248899',
    status: 'pending', // pending待支付, renting租赁中, finished已完成
    totalPrice: '11.6',
    accountInfo: {
      id: 101,
      title: '【包赔】V10全英雄全皮肤/武则天/典藏皮肤多款可选极品号',
      cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
      server: '安卓QQ区',
      tags: ['2小时起租'],
      price: '5.8'
    }
  }
]);

// 状态字典转换
const getStatusText = (status) => {
  const map = { pending: '待付款', renting: '租赁中', finished: '已完成' };
  return map[status] || '未知状态';
};
</script>

<style scoped>
.order-page {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 50px;
}
.list-container {
  padding: 12px;
}
.order-item {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}
.order-no {
  color: #666;
}
.status-text {
  font-weight: bold;
}
.status-text.pending { color: #ee0a24; }
.status-text.renting { color: #07c160; }
.status-text.finished { color: #999; }

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
}
.total {
  font-size: 13px;
  color: #333;
}
.total span {
  color: #ee0a24;
  font-size: 16px;
  font-weight: bold;
}
.actions {
  display: flex;
  gap: 8px;
}
</style>