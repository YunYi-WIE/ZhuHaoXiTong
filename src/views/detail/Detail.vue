<template>
  <div class="responsive-detail-page">
    
    <NavBar class="desktop-only" />

    <van-nav-bar 
      title="账号详情" 
      left-arrow 
      @click-left="router.back()" 
      class="mobile-nav mobile-only transparent-nav"
      fixed
      :border="false"
    />

    <main class="main-content">
      
      <div class="breadcrumb desktop-only">
        <span class="link" @click="router.push('/')">首页</span>
        <van-icon name="arrow" class="separator" />
        <span class="link" @click="router.push('/lobby')">租号大厅</span>
        <van-icon name="arrow" class="separator" />
        <span class="current">账号详情</span>
      </div>

      <div class="detail-top-wrap pc-glass-card">
        
        <div class="gallery-section">
          <van-swipe class="detail-swipe" :autoplay="3000" indicator-color="#1900ff">
            <van-swipe-item v-for="(img, index) in images" :key="index">
              <img :src="img" class="gallery-img" />
            </van-swipe-item>
          </van-swipe>
          <div class="server-badge">安卓QQ区</div>
        </div>

        <div class="info-section mobile-glass-card">
          <div class="price-panel">
            <div class="price-row">
              <span class="label">时租价：</span>
              <span class="price">￥<b>5.80</b> /小时</span>
            </div>
            <div class="price-row">
              <span class="label">押金：</span>
              <span class="deposit">免押金</span>
            </div>
          </div>

          <h1 class="goods-title">
            <span class="tag">包赔</span>
            V10全英雄全皮肤/绝版武则天/星空梦想典藏极品号
          </h1>

          <div class="attr-grid">
            <div class="attr-item"><span class="label">游戏区服：</span>安卓 QQ区</div>
            <div class="attr-item"><span class="label">账号等级：</span>30级</div>
            <div class="attr-item"><span class="label">排位赛：</span>最强王者 (允许排位)</div>
            <div class="attr-item"><span class="label">上架时间：</span>2023-10-25</div>
          </div>

          <div class="pc-actions desktop-only">
            <button class="pc-rent-btn gradient-btn" @click="goToPay">立即租赁</button>
            <button class="pc-cs-btn" @click="showHelp = true"><van-icon name="chat-o" /> 联系客服</button>
          </div>
        </div>
      </div>

      <div class="detail-bottom-card glass-card">
        <van-tabs v-model:active="activeTab" color="#1900ff" animated class="custom-tabs">
          <van-tab title="号主寄语与描述" name="desc">
            <div class="desc-content">
              <p>号主直租，绝对安全！纯手工打造心血号，全英雄满铭文。</p>
              <p class="highlight">【严禁行为】</p>
              <p>1. 禁止开挂：发现开挂直接报警，切勿以身试法！<br>
                 2. 禁止毁号：动用号内点券、删好友、恶意掉分等行为必追究赔偿。<br>
                 3. 禁止逃单：如遇密码错误请立刻联系客服，超时不予退款。</p>
              <p>祝老板游戏愉快，把把MVP！大吉大利，今晚吃鸡！</p>
            </div>
          </van-tab>
          <van-tab title="安全保障" name="security">
            <div class="security-content">
              <div class="sec-item"><b>平台验号</b>：该账号已通过平台人工审核，截图与实际相符。</div>
              <div class="sec-item"><b>顶号包赔</b>：租赁期间如被号主挤号，按剩余时间比例退款并补偿。</div>
              <div class="sec-item"><b>防沉迷限制</b>：该账号已成年，无防沉迷限制，可畅玩。</div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </main>

    <van-action-bar class="mobile-only action-bar-safe">
      <van-action-bar-icon icon="chat-o" text="客服" color="#333" @click="showHelp = true" />
      <van-action-bar-button type="danger" text="立即租赁" @click="goToPay" color="linear-gradient(to right, #1900ff, #00e5ff)" />
    </van-action-bar>

    <van-dialog v-model:show="showHelp" title="专属客服" show-cancel-button>
      <div style="text-align: center; padding: 20px;">
        <img src="https://fastly.jsdelivr.net/npm/@vant/assets/qrcode.png" style="width: 150px;" />
        <p style="margin-top: 10px; color: #666;">扫码添加官方客服</p>
      </div>
    </van-dialog>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const activeTab = ref('desc');
const showHelp = ref(false);

const images = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
]);

const goToPay = () => {
  router.push('/pay');
};
</script>

<style scoped>
/* =========================================
   全局基础设定
   ========================================= */
.responsive-detail-page {
  background: linear-gradient(to bottom, #1900ff 0%, #ffffff 90%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* 🚀 1. 导航栏单独一栏：改为全站统一的电竞深色底，白字 */
:deep(.mobile-nav) { 
  background: #171c26 !important; 
  z-index: 100 !important; 
}
:deep(.mobile-nav .van-nav-bar__title) { 
  color: #fff !important; 
  font-weight: bold; 
  font-size: 16px;
}
:deep(.mobile-nav .van-icon) { 
  color: #fff !important; 
  font-size: 22px;
}
:deep(.van-hairline--bottom:after) { border-bottom-width: 0 !important; }

/* =========================================
   卡片与模块通用样式
   ========================================= */
.gallery-img { width: 100%; object-fit: cover; display: block; }
.server-badge {
  position: absolute; bottom: 10px; right: 10px;
  background: rgba(0,0,0,0.6); color: #fff;
  font-size: 11px; padding: 4px 10px; border-radius: 12px; backdrop-filter: blur(4px);
}

.price-panel { background: #f5f7fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
.price-row .label { color: #666; font-size: 12px; }
.price { color: #ff3b30; font-size: 14px; }
.price b { font-size: 26px; font-family: DINAlternate-Bold, sans-serif; }
.deposit { color: #00c77b; background: #e6f9f1; padding: 2px 6px; border-radius: 4px; font-size: 11px; border: 1px solid rgba(7,193,96,0.3); }

.goods-title { font-size: 16px; color: #333; line-height: 1.4; margin: 0 0 15px 0; font-weight: bold; }
.tag { background: linear-gradient(90deg, #ff3b30, #ff8000); color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-right: 6px; }

.attr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
.attr-item { color: #333; font-size: 13px; }
.attr-item .label { color: #999; }

:deep(.custom-tabs .van-tab--active) { font-weight: bold; }
:deep(.custom-tabs .van-tabs__nav) { background: transparent; }
.desc-content { line-height: 1.8; color: #444; font-size: 14px; padding: 15px 5px; }
.highlight { color: #ff3b30; font-weight: bold; margin-top: 15px; }
.security-content { padding: 15px 5px; }
.sec-item { margin-bottom: 12px; color: #555; font-size: 14px; line-height: 1.6; }

/* =========================================
   ✨ 核心：纯 CSS 多端响应式
   ========================================= */

/* --- 📱 手机端特有 --- */
@media (max-width: 767px) {
  .desktop-only { display: none !important; }
  /* 🚀 修复：直接删掉 .mobile-only 的强制 flex，让 Vant 自己处理布局 */
  
  .main-content { padding-bottom: 70px; }
  .detail-top-wrap { display: flex; flex-direction: column; }
  
  /* 2. 图片铺满逻辑加强 */
  .gallery-section { 
    width: 100vw; 
    height: 380px; 
    position: relative; 
    background: #fff; 
  }
  .gallery-img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
  }

  /* 悬浮的玻璃卡片 */
  .mobile-glass-card {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 20px 20px 12px 12px;
    margin: -30px 15px 15px 15px;
    padding: 20px 15px;
    position: relative;
    z-index: 2;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08); 
  }

  .detail-bottom-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    margin: 0 15px 15px 15px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .action-bar-safe {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  }
}

/* --- 💻 电脑端特有 (>= 768px) --- */
@media (min-width: 768px) {
  .mobile-only { display: none !important; }
  .desktop-only { display: flex !important; }
  
  .main-content {
    max-width: 1200px; margin: 0 auto;
    padding: 80px 15px 50px 15px; 
  }

  .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 14px; margin-bottom: 20px; color: rgba(255,255,255,0.8); }
  .breadcrumb .link { cursor: pointer; transition: color 0.2s; }
  .breadcrumb .link:hover { color: #00e5ff; }
  .breadcrumb .separator { color: rgba(255,255,255,0.5); font-size: 12px; }
  .breadcrumb .current { color: #fff; font-weight: bold; }

  .pc-glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex; gap: 30px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  
  .gallery-section { width: 450px; flex-shrink: 0; border-radius: 8px; overflow: hidden; position: relative; }
  .gallery-img { height: 320px; }
  
  .info-section { flex: 1; display: flex; flex-direction: column; }
  .goods-title { font-size: 22px; }

  .pc-actions { margin-top: auto; display: flex; gap: 15px; }
  .gradient-btn { width: 180px; height: 48px; background: linear-gradient(90deg, #1900ff, #00e5ff); color: #fff; border: none; border-radius: 24px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(25, 0, 255, 0.3); transition: transform 0.2s; }
  .gradient-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(25, 0, 255, 0.4); }
  
  .pc-cs-btn { height: 48px; padding: 0 25px; background: #f0f2f5; color: #333; border: none; border-radius: 24px; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; font-weight: bold; }
  .pc-cs-btn:hover { background: #e4e7ed; color: #1900ff; }

  .detail-bottom-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px; padding: 25px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  .desc-content { font-size: 15px; }
}
</style>