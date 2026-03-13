<template>
  <div class="detail-page">
    <van-nav-bar title="账号详情" left-arrow @click-left="goBack" fixed placeholder />
    
    <van-swipe class="swipe-box" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(img, index) in images" :key="index">
        <img :src="img" class="swipe-img" />
      </van-swipe-item>
    </van-swipe>

    <div class="info-card">
      <div class="price-line">
        <div class="price-left">
          <span class="price">￥<b>5.80</b>/小时</span>
        </div>
        <div class="price-right">
          <span class="deposit-tag">押金: ￥0.00</span>
        </div>
      </div>
      
      <div class="title">
        <span class="tag-bao">包赔</span>
        V10全英雄全皮肤/绝版武则天/星空梦想典藏极品号
      </div>

      <div class="security-banner">
        <div class="sec-item"><van-icon name="passed" color="#07c160" /> 平台验号</div>
        <div class="sec-item"><van-icon name="passed" color="#07c160" /> 找回包赔</div>
        <div class="sec-item"><van-icon name="passed" color="#07c160" /> 顶号包赔</div>
      </div>
    </div>

    <div class="attr-card">
      <van-cell title="账号属性" :border="false" style="font-weight: bold; padding-left: 0; padding-top: 0;" />
      <div class="attr-grid">
        <div class="attr-item">
          <span class="label">游戏区服</span>
          <span class="value">安卓 QQ区</span>
        </div>
        <div class="attr-item">
          <span class="label">段位</span>
          <span class="value">最强王者</span>
        </div>
        <div class="attr-item">
          <span class="label">账号等级</span>
          <span class="value">30级</span>
        </div>
        <div class="attr-item">
          <span class="label">防沉迷</span>
          <span class="value">无限制</span>
        </div>
      </div>
    </div>

    <div class="desc-card">
      <van-cell title="号主寄语" :border="false" style="font-weight: bold; padding-left: 0; padding-top: 0;" />
      <p class="desc-text">
        号主直租，绝对安全！纯手工打造心血号。
        <br>【禁止开挂】发现开挂直接报警，切勿以身试法！
        <br>【禁止毁号】动用号内点券、删好友等行为必追究。
        <br>祝老板游戏愉快，把把MVP！
      </p>
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

const images = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
]);

const goBack = () => router.back();
const goToRent = () => router.push('/login');
</script>

<style scoped>
.detail-page { background: #f5f6f7; min-height: 100vh; padding-bottom: 60px; }
.swipe-img { width: 100%; height: 260px; object-fit: cover; }

.info-card, .attr-card, .desc-card {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.price { color: #ee0a24; font-size: 14px; }
.price b { font-size: 26px; font-weight: bold; }
.deposit-tag { font-size: 12px; color: #999; }

.title { font-size: 16px; font-weight: bold; color: #333; line-height: 24px; margin-bottom: 15px; }
.tag-bao {
  background: #ee0a24; color: #fff; font-size: 11px; padding: 2px 5px; 
  border-radius: 4px; margin-right: 5px; font-weight: normal; vertical-align: top;
}

.security-banner {
  display: flex; justify-content: space-between; background: #fdfaf6;
  padding: 10px; border-radius: 8px; font-size: 12px; color: #666;
}
.sec-item { display: flex; align-items: center; gap: 4px; }

/* 属性网格 */
.attr-grid {
  display: flex; flex-wrap: wrap; gap: 10px;
}
.attr-item {
  width: calc(50% - 5px); background: #f8f9fa; padding: 10px; 
  border-radius: 6px; display: flex; flex-direction: column; gap: 4px;
  box-sizing: border-box;
}
.attr-item .label { font-size: 12px; color: #999; }
.attr-item .value { font-size: 13px; color: #333; font-weight: bold; }

.desc-text { font-size: 13px; color: #666; line-height: 1.6; margin: 0; }
</style>