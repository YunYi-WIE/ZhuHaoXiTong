<template>
  <div class="message-page">
    <NavBar activeMenu="message" />
    <div class="page-content">
      <h2>消息中心</h2>
      <p>系统通知、交易沟通等功能将在这里展示。</p>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<style scoped>
.message-page { min-height: 100vh; background: #f5f7fa; }
.page-content { padding: 80px 20px 20px; text-align: center; color: #666; }
</style>