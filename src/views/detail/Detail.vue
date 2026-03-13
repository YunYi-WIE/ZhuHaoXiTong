<template>
  <div class="detail-page">
    <van-nav-bar 
      title="账号详情" 
      left-arrow 
      @click-left="goBack" 
      fixed 
      placeholder 
    />
    
    <van-swipe class="swipe-box" :autoplay="3000">
      <van-swipe-item v-for="(img, index) in images" :key="index">
        <img :src="img" class="swipe-img" />
      </van-swipe-item>
    </van-swipe>

    <div class="info-card">
      <div class="price-line">
        <span class="price">￥<b>5.8</b>/小时</span>
        <van-tag type="danger" plain>免押金</van-tag>
      </div>
      <div class="title">【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏极品号</div>
      <div class="tags">
        <van-tag type="primary" color="#f2f3f5" text-color="#333">安卓QQ区</van-tag>
        <van-tag type="primary" color="#f2f3f5" text-color="#333">排位不禁</van-tag>
        <van-tag type="primary" color="#f2f3f5" text-color="#333">等级：30</van-tag>
      </div>
    </div>

    <div class="desc-card">
      <h3>账号描述</h3>
      <p>号主直租，绝对安全！禁止开挂，发现报警处理。此号有绝版皮肤，请善待。</p>
    </div>

    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="star-o" text="收藏" />
      <van-action-bar-button type="danger" text="立即租赁" @click="goToRent" />
    </van-action-bar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 模拟账号截图
const images = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
]);

const goBack = () => {
  router.back(); // 返回上一页
};

const goToRent = () => {
  // 点击立即租赁，检查是否登录，如果没登录跳到登录页（这里直接模拟跳登录）
  router.push('/login');
};
</script>

<style scoped>
.detail-page {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 50px; /* 给底部操作栏留出空间 */
}
.swipe-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
.info-card, .desc-card {
  background: #fff;
  padding: 16px;
  margin-bottom: 10px;
}
.price-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.price {
  color: #ee0a24;
  font-size: 14px;
}
.price b {
  font-size: 24px;
}
.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
}
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.desc-card h3 {
  font-size: 15px;
  margin: 0 0 10px 0;
}
.desc-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}
</style>