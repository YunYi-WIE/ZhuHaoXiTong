<template>
  <div class="favorites-page">
    <van-nav-bar 
      title="我的收藏" 
      left-arrow 
      @click-left="goBack" 
      fixed 
      placeholder 
    />
    
    <div class="list-container">
      <van-empty v-if="favoriteList.length === 0" description="暂无收藏账号，快去大厅看看吧" />
      
      <div v-else>
        <AccountCard 
          v-for="item in favoriteList" 
          :key="item.id" 
          :item="item" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AccountCard from '@/components/AccountCard.vue';

const router = useRouter();

const goBack = () => {
  router.back();
};

// 模拟收藏列表数据
const favoriteList = ref([
  {
    id: 102,
    title: '和平精英 玛莎拉蒂/火箭少女101/多粉装退游甩租',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
    server: '苹果微信',
    tags: ['可排位', '高分段'],
    price: '4.0'
  }
]);
</script>

<style scoped>
.favorites-page {
  background: #f7f8fa;
  min-height: 100vh;
}
.list-container {
  padding: 12px;
}
</style>