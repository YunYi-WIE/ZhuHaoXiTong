<template>
  <div class="publish-page">
    <NavBar activeMenu="publish" />
    <div class="page-content">
      <h2>发布前准备</h2>
      <p>这里将搭建《网页手机端需求.docx》中的发布指引和截图上传表单。</p>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<style scoped>
.publish-page { min-height: 100vh; background: #f5f7fa; }
.page-content { padding: 80px 20px 20px; text-align: center; color: #666; }
</style>