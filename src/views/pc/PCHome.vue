<template>
  <div class="pc-layout">
    <div class="pc-header">
      <div class="header-inner">
        <div class="logo-box">
          <img src="@/assets/logo.png" class="pc-logo" />
          <span class="pc-brand">哈小龙小店</span>
        </div>
        
        <el-menu mode="horizontal" default-active="1" class="pc-nav" :ellipsis="false" @select="handleMenuSelect">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">租号大厅</el-menu-item>
          <el-menu-item index="3">帮助中心</el-menu-item>
        </el-menu>

        <div class="header-right">
          <el-input v-model="search" placeholder="搜索游戏 / 区服" class="pc-search">
            <template #append>
              <el-button icon="Search" />
            </template>
          </el-input>
          <el-button type="danger" round class="login-btn" @click="goTo('/pc-login')">登录 / 注册</el-button>
        </div>
      </div>
    </div>

    <div class="pc-main">
      <el-carousel height="300px" class="pc-carousel">
        <el-carousel-item v-for="(img, index) in pcBannerList" :key="index">
          <img :src="img" style="width: 100%; height: 100%; object-fit: cover;" />
        </el-carousel-item>
      </el-carousel>

      <h2 class="section-title">🔥 热门极品账号</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="i in 8" :key="i" style="margin-bottom: 20px;">
          <el-card shadow="hover" class="pc-account-card" @click="goTo('/pc-detail')">
            <div class="card-img">游戏截图</div>
            <div class="card-info">
              <div class="title">V10全英雄全皮肤/武则天</div>
              <div class="price">￥<b>5.80</b>/小时</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="showHelp" title="帮助中心与专属客服" width="400px" center>
      <div class="help-dialog-content">
        <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="qrcode-img" />
        <h3 style="margin: 10px 0; color: #333;">扫码添加专属客服</h3>
        <p class="wechat-id">微信号：<b style="color: #ff3b30;">haxiaolong_888</b></p>
        <p class="work-time">工作时间：09:00 - 24:00 (全年无休)</p>
        
        <el-divider border-style="dashed" />
        
        <div class="faq-list">
          <p>常见问题：</p>
          <ul>
            <li>• 租号需要交押金吗？</li>
            <li>• 密码错误怎么处理？</li>
            <li>• 租期没到不想玩了能退款吗？</li>
          </ul>
          <p style="font-size: 12px; color: #999; margin-top: 5px;">* 更多问题请直接咨询人工客服</p>
        </div>
      </div>
      <template #footer>
        <el-button type="danger" @click="showHelp = false" style="width: 100%;" round>我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const search = ref('');

// 👇 新增：控制客服弹窗显示的变量
const showHelp = ref(false);

// 👇 修改：导航栏点击跳转逻辑
const handleMenuSelect = (index) => {
  if (index === '1') router.push('/pc-home');
  if (index === '2') router.push('/pc-lobby');
  if (index === '3') showHelp.value = true; // 点帮助中心，直接弹出客服框！
};

// 通用跳转函数（用来跳转详情页）
const goTo = (path) => {
  router.push(path);
};

// 在 script setup 里面加上 PC 专属的宽屏轮播图数据
const pcBannerList = ref([
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop'
]);
</script>

<style scoped>
.pc-layout {
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 顶部导航栏样式 */
.pc-header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1200px; /* PC端经典居中宽度 */
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}
.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pc-logo { height: 40px; border-radius: 4px; }
.pc-brand { font-size: 20px; font-weight: bold; color: #333; }
.pc-nav { border-bottom: none !important; flex: 1; margin-left: 40px; }
.header-right { display: flex; align-items: center; gap: 20px; }
.pc-search { width: 250px; }

/* 主体内容样式 */
.pc-main {
  max-width: 1200px;
  margin: 20px auto;
  padding-bottom: 50px;
}
.pc-carousel { border-radius: 8px; overflow: hidden; margin-bottom: 30px; }
.carousel-img { background: #a0cfff; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff;}
.section-title { margin-bottom: 20px; color: #333; }
.pc-account-card { cursor: pointer; }
.card-img { height: 140px; background: #e9e9eb; display: flex; align-items: center; justify-content: center; color: #909399; margin: -20px -20px 15px -20px; }
.title { font-weight: bold; font-size: 14px; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.price { color: #f56c6c; }
.price b { font-size: 20px; }
/* 客服弹窗样式 */
.help-dialog-content { text-align: center; }
.qrcode-img { width: 160px; height: 160px; border-radius: 8px; border: 1px solid #eee; padding: 5px; }
.wechat-id { font-size: 15px; color: #666; margin: 5px 0; }
.work-time { font-size: 13px; color: #999; margin-bottom: 15px; }
.faq-list { text-align: left; background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 14px; color: #555; }
.faq-list ul { padding-left: 15px; margin: 10px 0; list-style: none; }
.faq-list li { margin-bottom: 8px; }
</style>