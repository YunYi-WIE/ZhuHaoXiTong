<template>
  <div class="app-layout">
    <router-view />

    <van-tabbar route fixed placeholder class="mobile-tabbar mobile-only" active-color="#1989fa" inactive-color="#999">
      <van-tabbar-item replace to="/home" icon="wap-home-o">首页</van-tabbar-item>
      
      <van-tabbar-item replace to="/publish">
        <template #icon>
          <div class="publish-btn-wrapper">
            <van-icon name="plus" class="publish-icon" />
          </div>
        </template>
        <span style="font-weight: bold; color: #333;">发布</span>
      </van-tabbar-item>

      <van-tabbar-item replace to="/message" icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
// 全局布局组件，无需额外 JS 逻辑
</script>

<style scoped>
/* 全局清爽背景色 */
.app-layout {
  min-height: 100vh;
  background-color: #f5f7fa; 
}

/* 底部导航条增加柔和阴影，去掉顶部黑线 */
.mobile-tabbar {
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.04);
}
:deep(.van-tabbar::after) {
  display: none;
}

/* 🚀 核心设计：向上凸起的发布按钮 */
.publish-btn-wrapper {
  background: #1989fa; /* 主题蓝 */
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -22px; /* 往上移，形成凸起效果 */
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.4);
  border: 4px solid #fff; 
  transition: transform 0.2s;
}
.publish-btn-wrapper:active {
  transform: scale(0.95);
}
.publish-icon {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

/* 🚀 多端响应式控制：屏幕大于 768px (PC) 时，隐藏手机端特有元素 */
@media (min-width: 768px) {
  .mobile-only {
    display: none !important;
  }
}
</style>