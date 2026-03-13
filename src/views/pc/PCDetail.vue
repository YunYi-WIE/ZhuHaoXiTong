<template>
  <div class="pc-detail-page">
    <div class="pc-header">
      <div class="header-inner">
        <div class="logo-box" @click="router.push('/pc-home')">
          <img src="@/assets/logo.png" class="pc-logo" />
          <span class="pc-brand">哈小龙小店</span>
        </div>
        <div class="header-right">
          <el-button @click="router.push('/pc-home')">返回首页</el-button>
        </div>
      </div>
    </div>

    <div class="pc-main">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/pc-home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/pc-lobby' }">租号大厅</el-breadcrumb-item>
        <el-breadcrumb-item>账号详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="top-card">
        <div class="gallery-box">
          <el-carousel trigger="click" height="320px">
            <el-carousel-item v-for="item in images" :key="item">
              <el-image :src="item" fit="cover" style="width: 100%; height: 100%;" />
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="info-box">
          <h1 class="title">
            <el-tag type="danger" effect="dark" style="margin-right: 8px;">包赔</el-tag>
            V10全英雄全皮肤/绝版武则天/星空梦想典藏极品号
          </h1>
          
          <div class="price-panel">
            <div class="price-item">
              <span class="label">时租价：</span>
              <span class="price">￥<b>5.80</b> /小时</span>
            </div>
            <div class="price-item">
              <span class="label">押金：</span>
              <span class="deposit">免押金</span>
            </div>
          </div>

          <div class="attr-list">
            <div class="attr-item"><span class="label">游戏区服：</span>安卓 QQ区</div>
            <div class="attr-item"><span class="label">账号等级：</span>30级</div>
            <div class="attr-item"><span class="label">排位赛：</span>最强王者 (允许排位)</div>
            <div class="attr-item"><span class="label">上架时间：</span>2023-10-25</div>
          </div>

          <div class="action-box">
            <el-button type="danger" size="large" class="rent-btn" @click="openOrderDialog">立即租赁</el-button>
            <el-button size="large" icon="Star">收藏账号</el-button>
            <el-button size="large" icon="ChatDotRound">联系客服</el-button>
          </div>
        </div>
      </div>

      <div class="bottom-card">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="号主寄语与描述" name="desc">
            <div class="desc-content">
              <p>号主直租，绝对安全！纯手工打造心血号，全英雄满铭文。</p>
              <p style="color: #f56c6c; font-weight: bold;">【严禁行为】</p>
              <p>1. 禁止开挂：发现开挂直接报警，切勿以身试法！<br>
                 2. 禁止毁号：动用号内点券、删好友、恶意掉分等行为必追究赔偿。<br>
                 3. 禁止逃单：如遇密码错误请立刻联系客服，超时不予退款。</p>
              <p>祝老板游戏愉快，把把MVP！大吉大利，今晚吃鸡！</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="安全保障" name="security">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="平台验号">该账号已通过平台人工审核，截图与实际相符。</el-descriptions-item>
              <el-descriptions-item label="顶号包赔">租赁期间如被号主挤号，按剩余时间比例退款并补偿。</el-descriptions-item>
              <el-descriptions-item label="防沉迷限制">该账号已成年，无防沉迷限制，可畅玩。</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog v-model="showOrderDialog" title="确认租赁订单" width="550px" destroy-on-close>
      <div class="order-confirm-box">
        <div class="goods-info">
          <img :src="images[0]" class="goods-img" />
          <div class="goods-desc">
            <h4 class="goods-title">【包赔】V10全英雄全皮肤/绝版武则天...</h4>
            <div class="goods-price">单价：<span style="color: #ff3b30;">￥5.80 / 小时</span></div>
          </div>
        </div>
        
        <el-divider border-style="dashed" />

        <el-form label-width="90px" class="order-form">
          <el-form-item label="租赁时长：">
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-input-number v-model="rentHours" :min="2" :max="24" size="large" /> 
              <span style="color: #999; font-size: 13px;">小时 (2小时起租)</span>
            </div>
          </el-form-item>
          
          <el-form-item label="支付方式：">
            <el-radio-group v-model="payMethod">
              <el-radio label="wechat" border><el-icon color="#07c160" style="margin-right: 5px;"><ChatDotRound /></el-icon>微信支付</el-radio>
              <el-radio label="alipay" border><el-icon color="#1677ff" style="margin-right: 5px;"><Platform /></el-icon>支付宝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <el-divider border-style="dashed" />

        <div class="total-price-box">
          <span class="tips">免押金，包含账号防找回包赔服务</span>
          <div class="calc-result">
            总计：<span class="total-price">￥{{ totalPrice }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showOrderDialog = false" size="large">暂不租赁</el-button>
          <el-button type="danger" size="large" @click="handlePay" :loading="isPaying" style="width: 150px;">
            {{ isPaying ? '正在支付...' : '确认付款' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const activeTab = ref('desc');

const images = ref([
  'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
]);

// --- 👇 下单与支付核心逻辑 👇 ---
const showOrderDialog = ref(false); // 控制弹窗显示
const rentHours = ref(2); // 默认租2小时
const payMethod = ref('wechat'); // 默认微信支付
const isPaying = ref(false); // 支付按钮的加载状态
const unitPrice = 5.80; // 单价

// 动态计算总价 (单价 * 时长)
const totalPrice = computed(() => {
  return (rentHours.value * unitPrice).toFixed(2);
});

// 点击“立即租赁”按钮，打开弹窗
const openOrderDialog = () => {
  // 实际开发中这里会判断有没有登录，没登录跳 /pc-login
  showOrderDialog.value = true;
};

// 点击“确认付款”
const handlePay = () => {
  isPaying.value = true;
  
  // 模拟请求后端的支付等待时间（1.5秒）
  setTimeout(() => {
    isPaying.value = false;
    showOrderDialog.value = false;
    ElMessage.success({ message: '支付成功！祝您游戏愉快！', duration: 2000 });
    
    // 支付成功后，跳转到个人中心的“我的订单”页
    setTimeout(() => {
      router.push('/pc-user'); 
    }, 1000);
  }, 1500);
};
</script>

<style scoped>
.pc-detail-page { background-color: #f5f7fa; min-height: 100vh; padding-bottom: 50px; }

/* 头部简易版 */
.pc-header { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
.logo-box { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.pc-logo { height: 40px; border-radius: 4px; }
.pc-brand { font-size: 20px; font-weight: bold; color: #333; }

.pc-main { max-width: 1200px; margin: 20px auto; }
.breadcrumb { margin-bottom: 20px; }

/* 顶部信息卡片 (左右布局) */
.top-card { display: flex; background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.gallery-box { width: 450px; margin-right: 30px; border-radius: 8px; overflow: hidden; }
.info-box { flex: 1; display: flex; flex-direction: column; }

.title { font-size: 22px; color: #333; margin: 0 0 20px 0; line-height: 1.4; }

.price-panel { background: #fdfaf6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.price-item { margin-bottom: 10px; }
.price-item:last-child { margin-bottom: 0; }
.price-item .label { color: #666; width: 60px; display: inline-block; }
.price { color: #ff3b30; font-size: 16px; }
.price b { font-size: 28px; }
.deposit { color: #00c77b; background: #e6f9f1; padding: 2px 8px; border-radius: 4px; font-size: 13px; }

.attr-list { display: flex; flex-wrap: wrap; margin-bottom: 30px; }
.attr-item { width: 50%; color: #333; font-size: 14px; margin-bottom: 15px; }
.attr-item .label { color: #999; }

.action-box { margin-top: auto; display: flex; gap: 15px; }
.rent-btn { width: 180px; font-weight: bold; }

/* 底部描述卡片 */
.bottom-card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); min-height: 300px; }
.desc-content { line-height: 1.8; color: #444; font-size: 15px; padding: 10px; }

/* 订单确认弹窗样式 */
.goods-info { display: flex; gap: 15px; align-items: center; }
.goods-img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }
.goods-desc { flex: 1; }
.goods-title { margin: 0 0 10px 0; font-size: 15px; color: #333; line-height: 1.4; }
.goods-price { font-size: 14px; color: #666; font-weight: bold; }
.order-form { margin-top: 20px; }
.total-price-box { display: flex; justify-content: space-between; align-items: flex-end; }
.total-price-box .tips { color: #00c77b; font-size: 13px; background: #e6f9f1; padding: 4px 8px; border-radius: 4px; }
.total-price { color: #ff3b30; font-size: 24px; font-weight: bold; font-family: DINAlternate-Bold, sans-serif; }
</style>