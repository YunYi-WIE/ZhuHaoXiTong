<template>
  <div class="app-layout">
    <div class="main-container">
      <router-view />
    </div>

    <van-tabbar 
      route 
      active-color="#1989fa" 
      inactive-color="#999999" 
      safe-area-inset-bottom
      class="mobile-bottom-tabbar mobile-only"
    >
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      
      <van-tabbar-item replace to="/lobby" icon="apps-o">大厅</van-tabbar-item>
      
      <van-tabbar-item replace to="/publish" class="publish-tab-item">
        <template #icon>
          <div class="publish-btn-wrapper">
            <van-icon name="plus" class="publish-icon" />
          </div>
        </template>
        发布
      </van-tabbar-item>

      <van-tabbar-item replace to="/message" icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
// 布局组件，依靠 van-tabbar 的 route 属性自动匹配路由高亮，无需复杂 JS
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 留出底部导航栏的高度，防止遮挡页面内容 */
.main-container {
  flex: 1;
  padding-bottom: 50px; 
}

/* 🚀 隐藏 PC 端的底部菜单 */
@media (min-width: 768px) {
  .mobile-only {
    display: none !important;
  }
  .main-container {
    padding-bottom: 0; /* PC端不需要底部留白 */
  }
}

/* =========================================
   🚀 中间凸起发布按钮专属样式
   ========================================= */
.mobile-bottom-tabbar {
  border-top: 1px solid #f2f3f5;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.02);
  z-index: 999;
}

.publish-tab-item {
  position: relative;
}

/* 悬浮的圆形按钮 */
.publish-btn-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1989fa, #00d2ff); /* 渐变蓝色 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -20px; /* 向上偏移形成凸起效果 */
  border: 3px solid #ffffff; /* 边缘描边融入背景 */
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
  transition: transform 0.2s;
}

.publish-btn-wrapper:active {
  transform: scale(0.95);
}

.publish-icon {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
}
</style>