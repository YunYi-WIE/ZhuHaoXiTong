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

    <van-tabbar v-model="active" route active-color="#ee0a24" inactive-color="#000">
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
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa; /* 灰白底色，突显卡片 */
}
.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px; /* 留出底部导航栏的高度 */
  -webkit-overflow-scrolling: touch;
}
</style>