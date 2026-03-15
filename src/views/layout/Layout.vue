<template>
  <div class="app-container">
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
      </router-view>
    </div>

    <van-tabbar v-model="active" route active-color="#1900ff" inactive-color="#000" class="mobile-tabbar" placeholder>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/lobby" icon="apps-o">租号大厅</van-tabbar-item>
      <van-tabbar-item replace to="/order" icon="orders-o">订单</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const active = ref(0);
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 移动端默认状态：给底部导航栏留出空间 */
.main-content {
  flex: 1;
}

/* 🚀 核心媒体查询：当屏幕 >= 768px (PC/平板) 时触发 */
@media (min-width: 768px) {
  /* 1. 强行隐藏底部导航栏 */
  .mobile-tabbar {
    display: none !important;
  }
  /* 2. PC端不需要给底部留白了，取消 padding-bottom */
  .main-content {
    padding-bottom: 0 !important; 
  }
}
</style>