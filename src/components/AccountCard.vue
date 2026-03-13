<template>
  <div class="account-card" @click="goToDetail">
    <div class="card-left">
      <van-image :src="item.cover" width="100" height="100" radius="8" fit="cover" />
      <span class="server-badge">{{ item.server }}</span>
    </div>
    
    <div class="card-right">
      <div class="title van-multi-ellipsis--l2">
        <span class="tag-bao" v-if="item.isBao">包赔</span>
        {{ item.title }}
      </div>
      
      <div class="tags">
        <van-tag 
          v-for="(tag, index) in item.tags" 
          :key="index"
          :color="index % 2 === 0 ? '#f0f7ff' : '#fff5f0'" 
          :text-color="index % 2 === 0 ? '#3a7afe' : '#ff6034'"
          size="mini"
        >
          {{ tag }}
        </van-tag>
      </div>
      
      <div class="price-box">
        <div class="price-info">
          <span class="price">￥<b>{{ item.price }}</b><span class="unit">/小时</span></span>
          <span class="deposit">免押金</span>
        </div>
        <button class="rent-btn" @click.stop="goToDetail">租</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({ item: { type: Object, required: true } });
const router = useRouter();
const goToDetail = () => router.push('/detail');
</script>

<style scoped>
.account-card {
  display: flex; background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); /* 加深一点阴影使卡片更立体 */
}
.card-left {
  position: relative;
  width: 100px;
  height: 100px;
  margin-right: 12px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden; /* 核心：超出部分直接裁剪，绝对不会溢出到右边 */
}
:deep(.van-image) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
.server-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: #fff;
  font-size: 10px;
  text-align: center;
  padding: 15px 0 4px; /* 加大一点 padding 让渐变过渡更自然 */
  z-index: 1;
  white-space: nowrap; /* 核心：强制一行显示 */
  overflow: hidden;
  text-overflow: ellipsis; /* 核心：太长就显示省略号 */
}
.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 2px 0; /* 上下稍微留出一点间隙 */
}
.title { font-size: 14px; font-weight: bold; color: #2c3e50; line-height: 20px; }
.tag-bao {
  background: linear-gradient(135deg, #ff6034, #ee0a24); /* 包赔标签渐变 */
  color: #fff; font-size: 10px; padding: 1px 4px; border-radius: 4px; margin-right: 4px; vertical-align: middle;
}
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
.price-box { display: flex; justify-content: space-between; align-items: center; }
.price-info { display: flex; align-items: baseline; gap: 6px; }
.price { color: #ff3b30; font-size: 12px; }
.price b { font-size: 18px; font-family: DINAlternate-Bold, sans-serif; }
.unit { font-size: 10px; color: #999; }
.deposit {
  font-size: 10px; color: #00c77b; background: #e6f9f1; padding: 2px 5px; border-radius: 4px;
}
/* 炫彩租号按钮 */
.rent-btn {
  width: 44px; height: 26px; border: none; border-radius: 13px; color: #fff; font-size: 12px; font-weight: bold;
  background: linear-gradient(135deg, #ff7a59, #ff3b30);
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.3);
}
.rent-btn:active { transform: scale(0.95); }
</style>