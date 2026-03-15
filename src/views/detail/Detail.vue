<template>
  <div class="detail-page esports-detail">
    <van-nav-bar 
      title="账号详情" 
      left-arrow 
      @click-left="onClickLeft"
      class="custom-nav-detail"
    />

    <div class="gallery-card-detail">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1900ff">
        <van-swipe-item v-for="(img, index) in images" :key="index">
          <img :src="img" class="gallery-img-detail" />
        </van-swipe-item>
      </van-swipe>
      <div class="server-badge-detail">安卓QQ区</div>
    </div>

    <div class="info-card-detail">
      <div class="price-row-detail">
        <span class="price-symbol">￥</span>
        <span class="price-num">5.80</span>
        <span class="price-unit">/ 小时</span>
        <span class="deposit-tag">免押金</span>
      </div>
      <h2 class="goods-title-detail">【秒发】V10全英雄全皮肤/绝版武则天/星空梦想典藏/极品连体号</h2>
      
      <div class="tags-group-detail">
        <span class="tag-detail color-green">官方包赔</span>
        <span class="tag-detail color-orange">排位不禁</span>
        <span class="tag-detail color-blue">极品号</span>
        <span class="tag-detail color-red">秒上号</span>
      </div>
    </div>

    <div class="specs-card-detail">
      <h3 class="card-title-detail">账号参数</h3>
      <div class="specs-grid-detail">
        <div class="spec-item-detail"><span class="spec-label-detail">游戏段位</span><span class="spec-value-detail">最强王者</span></div>
        <div class="spec-item-detail"><span class="spec-label-detail">英雄数量</span><span class="spec-value-detail">118</span></div>
        <div class="spec-item-detail"><span class="spec-label-detail">皮肤数量</span><span class="spec-value-detail">450+</span></div>
        <div class="spec-item-detail"><span class="spec-label-detail">贵族等级</span><span class="spec-value-detail text-red-detail">V10</span></div>
      </div>
    </div>

    <div class="notice-card-detail">
      <h3 class="card-title-detail">租客须知</h3>
      <ul class="notice-list-detail">
        <li>1. 租赁期间严禁使用任何第三方辅助工具、外挂或修改器。</li>
        <li>2. 严禁在游戏内发布违规言论、恶意挂机或演员行为。</li>
        <li>3. 本账号已开启“实名及设备防毁保赔”。</li>
        <li>4. 订单时间结束后，系统将自动顶号，请合理安排游戏时间。</li>
      </ul>
    </div>

    <div class="action-bar-detail">
      <div class="action-icons-detail">
        <div class="icon-item-detail">
          <van-icon name="chat-o" size="22" color="#666" />
          <span>客服</span>
        </div>
        
        <div class="icon-item-detail favorite-item-detail" @click="toggleFavorite">
          <van-icon 
            v-if="!isFavorited"
            name="star-o" 
            size="22" 
            color="#666" 
            class="fav-icon-out"
          />
          <van-icon 
            v-if="isFavorited"
            name="star" 
            size="22" 
            color="#ff9500" 
            class="fav-icon-filled"
          />
          <span :style="{ color: isFavorited ? '#ff9500' : '#666' }">
            {{ isFavorited ? '已收藏' : '收藏' }}
          </span>
        </div>
      </div>
      <button class="rent-btn-detail" @click="handleRent">立即租赁</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

const images = ref([
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop'
]);

// 保留控制收藏状态的逻辑
const isFavorited = ref(false);

const onClickLeft = () => {
  router.back();
};

// 保留切换收藏状态的函数
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
  if (isFavorited.value) {
    showToast('收藏成功');
  }
};

const handleRent = () => {
  // 🚀 跳转到支付页面
  router.push('/pay');
};
</script>

/* src/views/detail/Detail.vue style section */
<style scoped>
/* 🚀 整个页面背景 - 统一紫蓝固定渐变底 */
.detail-page.esports-detail {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed; /* 背景钉住不动 */
  min-height: 100vh;
  /* 🚀 核心修改：因为导航栏不再固定，所以不需要 padding-top 来顶出空间了！把 padding-top: 46px 删掉 */
  padding-bottom: 90px; 
  box-sizing: border-box; 
}

/* 🚀 核心修改：让顶栏回归自然文档流，随页面滚动 */
:deep(.custom-nav-detail) {
  background: transparent !important; /* 保持背景透明 */
  /* 删掉了 position: fixed 等强制固定的代码 */
  position: relative; 
  z-index: 10;
}

/* 顶栏文字和图标改为白色，更赛博朋克 */
:deep(.custom-nav-detail .van-nav-bar__title), 
:deep(.custom-nav-detail .van-icon) {
  color: #fff !important;
  font-weight: bold;
}

/* 撕掉 Vant 自带的底边框（Hairline） */
:deep(.van-hairline--bottom:after) {
  border-bottom-width: 0 !important;
}

/* 🚀 详情相册卡片化 */
.gallery-card-detail {
  margin: 10px 15px 15px 15px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  background: #fff;
}
.gallery-img-detail { width: 100%; height: 220px; object-fit: cover; display: block; }
.server-badge-detail {
  position: absolute; top: 10px; right: 10px;
  background: rgba(0,0,0,0.6); color: #fff;
  font-size: 12px; padding: 4px 10px; border-radius: 12px; backdrop-filter: blur(4px);
}

/* 白底卡片通用样式 */
.info-card-detail, .specs-card-detail, .notice-card-detail {
  background: #ffffff;
  border-radius: 16px;
  margin: 0 15px 15px 15px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.price-row-detail { display: flex; align-items: baseline; margin-bottom: 10px; }
.price-symbol-detail { color: #ff3b30; font-size: 16px; font-weight: bold; }
.price-num-detail { color: #ff3b30; font-size: 28px; font-weight: bold; font-family: DINAlternate-Bold, sans-serif; }
.price-unit-detail { color: #999; font-size: 12px; margin-left: 2px; }
.deposit-tag-detail { background: rgba(7, 193, 96, 0.1); color: #07c160; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 10px; border: 1px solid rgba(7, 193, 96, 0.3); }

.goods-title-detail { font-size: 16px; color: #333; line-height: 1.5; margin: 0 0 12px 0; font-weight: bold; }

.tags-group-detail { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-detail { font-size: 11px; padding: 3px 8px; border-radius: 4px; }
.color-green { color: #07c160; background: rgba(7, 193, 96, 0.1); }
.color-orange { color: #ff9500; background: rgba(255, 149, 0, 0.1); }
.color-blue { color: #1677ff; background: rgba(22, 119, 255, 0.1); }
.color-red { color: #ff3b30; background: rgba(255, 59, 48, 0.1); }

.card-title-detail { font-size: 15px; color: #333; margin: 0 0 15px 0; font-weight: bold; border-left: 3px solid #1900ff; padding-left: 8px; line-height: 1; }
.specs-grid-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.spec-item-detail { display: flex; justify-content: space-between; font-size: 13px; }
.spec-label-detail { color: #999; }
.spec-value-detail { color: #333; font-weight: bold; }
.text-red-detail { color: #ff3b30; }

.notice-list-detail { list-style: none; padding: 0; margin: 0; }
.notice-list-detail li { font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 8px; }

/* 🚀 底部悬浮操作栏 - 固定容器高度，稳定图标位置 */
.action-bar-detail {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: 60px; background: #fff;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}
.action-icons-detail { display: flex; gap: 20px; margin-left: 10px; }

/* 🚀 核心修复 2 样式：固定图标项目的大小，消除位移 */
.icon-item-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666;
  gap: 2px;
  /* 核心：固定宽度和高度，即使图标内部变化，容器尺寸也钉死，绝不产生位移！ */
  width: 40px; 
  height: 100%; 
}

/* 核心：确保图标和文字在其容器内居中 */
:deep(.van-icon) {
  display: block; 
  margin: 0 auto;
}

.favorite-item-detail {
  cursor: pointer;
}

.rent-btn-detail {
  background: linear-gradient(90deg, #ff6034, #ff3b30);
  color: #fff; border: none;
  height: 40px; width: 60%;
  border-radius: 20px; font-size: 16px; font-weight: bold;
  box-shadow: 0 4px 10px rgba(255, 59, 48, 0.3);
}
.rent-btn-detail:active { transform: scale(0.98); }
</style>