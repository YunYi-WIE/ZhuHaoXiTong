<template>
  <div class="account-card" v-if="info" @click="$emit('click')">
    <div class="card-image">
      <van-image :src="getCover(info.images)" fit="cover" radius="8" />
      <div class="region-tag">{{ info.gameRegion || '全区服' }}</div>
    </div>
    <div class="card-info">
      <div class="title van-multi-ellipsis--l2">{{ info.title }}</div>
      <div class="params">
        <van-tag plain type="primary" v-if="info.accountLevel">{{ info.accountLevel }}</van-tag>
        <van-tag plain type="success" v-if="info.tags">{{ info.tags.split(',')[0] }}</van-tag>
      </div>
      <div v-if="info.ratioLine" class="ratio-line">{{ info.ratioLine }}</div>
      <div class="price-row">
        <span class="price">￥{{ info.pricePerHour }}<small>/时</small></span>
        <div class="price-row__btns">
          <van-button size="mini" type="warning" plain round @click.stop="$emit('reserve')">预约</van-button>
          <van-button size="mini" type="primary" round @click.stop="$emit('rent')">租号</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  info: {
    type: Object,
    required: true,
    default: () => null
  }
});

defineEmits(['click', 'reserve', 'rent']);

// 提取第一张图片的辅助函数
const getCover = (images) => {
  if (images && typeof images === 'string') {
    return images.split(',')[0];
  }
  return 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'; // 兜底默认图
};
</script>

<style scoped>
/* 样式保持你原来的不变即可 */
.account-card { background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); cursor: pointer; }
.card-image { position: relative; height: 132px; width: 100%; }
:deep(.van-image) { width: 100%; height: 100%; }
.region-tag { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.6); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; z-index: 1; }
.card-info { padding: 10px; }
.title { font-size: 14px; font-weight: bold; color: #333; height: 40px; margin-bottom: 8px; line-height: 20px; }
.params { display: flex; gap: 5px; margin-bottom: 10px; }
.ratio-line { font-size: 11px; color: #888; line-height: 1.35; margin: 0 0 8px; }
.price-row { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.price-row__btns { display: flex; gap: 6px; flex-shrink: 0; }
.price { color: #ee0a24; font-size: 16px; font-weight: bold; }
.price small { font-size: 11px; font-weight: normal; }

@media (max-width: 380px) {
  .card-image { height: 118px; }
  .card-info { padding: 8px; }
  .title { font-size: 13px; line-height: 18px; height: 36px; margin-bottom: 6px; }
  .price { font-size: 15px; }
}

@media (min-width: 768px) {
  .card-image { height: 140px; }
}
</style>