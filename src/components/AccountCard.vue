<template>
  <div class="account-card" @click="goToDetail">
    <div class="card-left">
      <van-image :src="item.cover" width="90" height="90" radius="8" fit="cover" />
      <span class="badge">{{ item.server }}</span>
    </div>
    
    <div class="card-right">
      <div class="title van-multi-ellipsis--l2">{{ item.title }}</div>
      
      <div class="tags">
        <van-tag plain type="primary" size="small" v-for="(tag, index) in item.tags" :key="index">
          {{ tag }}
        </van-tag>
      </div>
      
      <div class="price-box">
        <span class="price">￥<b>{{ item.price }}</b>/小时</span>
        <van-button type="danger" size="mini" round @click.stop="goToDetail">租号</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// 接收父页面传过来的账号数据
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const router = useRouter();

// 点击卡片跳转到详情页
const goToDetail = () => {
  // 真正的路由跳转逻辑
  router.push('/detail'); 
  
  // 等后期后端给了接口，我们需要带着账号ID跳，到时候改成下面这句：
  // router.push({ path: '/detail', query: { id: props.item.id } });
};
</script>

<style scoped>
.account-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  cursor: pointer;
}
.card-left {
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}
.card-left .badge {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px 0 8px 0;
  z-index: 1;
}
.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0; /* 防止文字过长撑破弹性盒子 */
}
.card-right .title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  line-height: 20px;
}
.card-right .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 6px 0;
}
.card-right .price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price-box .price {
  color: #ee0a24;
  font-size: 12px;
}
.price-box .price b {
  font-size: 18px;
}
</style>