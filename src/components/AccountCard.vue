<template>
  <div class="account-card user-card" @click="goToDetail">
    <div class="cover-box">
      <img :src="item.cover" class="cover-img" />
      <div class="server-tag">{{ item.server }}</div>
      <div v-if="item.isBao" class="bao-tag">包赔</div>
    </div>
    <div class="info-box">
      <h4 class="title">{{ item.title }}</h4>
      <div class="tags">
        <span 
          v-for="(tag, index) in item.tags" 
          :key="tag" 
          class="tag"
          :class="'tag-text-color-' + (index % 4)"
        >
          {{ tag }}
        </span>
      </div>
      <div class="price-row">
        <span class="price">￥<b>{{ item.price }}</b> /小时</span>
        <button class="rent-btn">立即租</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const goToDetail = () => {
  router.push('/detail'); // 点击卡片跳到详情页
};
</script>

<style scoped>
/* 🚀 核心：白底黑字卡片主体 */
.account-card.user-card {
  display: flex;
  background: #ffffff; /* 核心：白底 */
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 15px;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.account-card.user-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* 左侧图片区 */
.cover-box {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}
.cover-img { width: 100%; height: 100%; object-fit: cover; }

/* 区服标签 */
.server-tag {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  text-align: center;
  padding: 3px 0;
  backdrop-filter: blur(2px);
}

/* 渐变包赔标 */
.bao-tag {
  position: absolute;
  top: 0; left: 0;
  background: linear-gradient(135deg, #ff3b30, #ff8000);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-bottom-right-radius: 8px;
  font-weight: bold;
}

/* 右侧信息区 */
.info-box {
  margin-left: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 核心：卡片标题白底黑字 */
.title {
  margin: 0;
  font-size: 14px;
  color: #000; /* 核心：黑字 */
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* 🚀 核心：标签彩色字体 */
.tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
.tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}
/* 根据索引循环使用不同的彩色字体 */
.tag-text-color-0 { color: #07c160; background: rgba(7, 193, 96, 0.1); }
.tag-text-color-1 { color: #ff8000; background: rgba(255, 128, 0, 0.1); }
.tag-text-color-2 { color: #1677ff; background: rgba(22, 119, 255, 0.1); }
.tag-text-color-3 { color: #ff3b30; background: rgba(255, 59, 48, 0.1); }

/* 底部价格与按钮 */
.price-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.price { color: #ff3b30; font-size: 12px; }
.price b { font-size: 18px; font-family: DINAlternate-Bold, sans-serif; }

/* 按钮镂空设计 */
.rent-btn {
  background: transparent;
  border: 1px solid #ff3b30;
  color: #ff3b30;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}
.rent-btn:active { background: #ff3b30; color: #fff; }
</style>