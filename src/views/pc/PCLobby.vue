<template>
  <div class="pc-lobby">
    <div class="pc-header">
      <div class="header-inner">
        <div class="logo-box" @click="goTo('/pc-home')">
          <img src="@/assets/logo.png" class="pc-logo" />
          <span class="pc-brand">哈小龙小店</span>
        </div>
        
        <el-menu mode="horizontal" default-active="2" class="pc-nav" :ellipsis="false" @select="handleMenuSelect">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">租号大厅</el-menu-item>
          <el-menu-item index="3">帮助中心</el-menu-item>
        </el-menu>

        <div class="header-right">
          <el-input v-model="search" placeholder="搜索游戏 / 区服" class="pc-search">
            <template #append><el-button icon="Search" /></template>
          </el-input>
          <el-button type="danger" round class="login-btn" @click="goTo('/pc-login')">登录 / 注册</el-button>
        </div>
      </div>
    </div>

    <div class="pc-main">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/pc-home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>租号大厅</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="filter-panel">
        <div class="filter-row">
          <span class="label">游戏分类：</span>
          <div class="options">
            <span 
              v-for="item in gameOptions" 
              :key="item" 
              class="option" 
              :class="{ active: activeGame === item }"
              @click="activeGame = item"
            >
              {{ item }}
            </span>
          </div>
        </div>
        <div class="filter-row">
          <span class="label">客户端区服：</span>
          <div class="options">
            <span 
              v-for="item in serverOptions" 
              :key="item" 
              class="option" 
              :class="{ active: activeServer === item }"
              @click="activeServer = item"
            >
              {{ item }}
            </span>
          </div>
        </div>
        <div class="filter-row" style="border-bottom: none;">
          <span class="label">排序方式：</span>
          <div class="options">
            <el-radio-group v-model="sortBy" size="small">
              <el-radio-button label="综合排序" />
              <el-radio-button label="价格最低" />
              <el-radio-button label="最新上架" />
            </el-radio-group>
          </div>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="6" v-for="i in 12" :key="i" style="margin-bottom: 20px;">
          <el-card shadow="hover" class="pc-account-card" @click="goTo('/pc-detail')">
            <div class="card-img">
              <img src="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg" style="width: 100%; height: 100%; object-fit: cover;" />
              <span class="server-tag">安卓QQ区</span>
            </div>
            <div class="card-info">
              <div class="title">【秒发】V10全英雄全皮肤/绝版武则天极品号</div>
              <div class="tags">
                <el-tag size="small" type="danger" effect="dark">包赔</el-tag>
                <el-tag size="small" type="info">极品连体</el-tag>
              </div>
              <div class="price-box">
                <span class="price">￥<b>5.80</b>/小时</span>
                <el-button type="danger" size="small" round>立即租</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="pagination-box">
        <el-pagination background layout="prev, pager, next, jumper" :total="100" />
      </div>
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

const showHelp = ref(false);
const router = useRouter();
const search = ref('');
const sortBy = ref('综合排序');

// 👇 新增：筛选条件的数据和当前选中的状态
const activeGame = ref('全部');
const gameOptions = ['全部', '王者荣耀', '和平精英', '原神', '永劫无间'];

const activeServer = ref('不限');
const serverOptions = ['不限', '安卓 QQ', '安卓 微信', '苹果 QQ', '苹果 微信'];
// 👆 新增结束

// 导航栏点击切换页面
const handleMenuSelect = (index) => {
  if (index === '1') router.push('/pc-home');
  if (index === '2') router.push('/pc-lobby');
  if (index === '3') showHelp.value = true; // 👈 关键：点第3个菜单时弹出窗口
};

// 通用跳转函数
const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.pc-lobby { background-color: #f5f7fa; min-height: 100vh; }

/* 头部样式 */
.pc-header { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
.logo-box { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.pc-logo { height: 40px; border-radius: 4px; }
.pc-brand { font-size: 20px; font-weight: bold; color: #333; }
.pc-nav { border-bottom: none !important; flex: 1; margin-left: 40px; }
.header-right { display: flex; align-items: center; gap: 20px; }
.pc-search { width: 250px; }

/* 主体样式 */
.pc-main { max-width: 1200px; margin: 20px auto; padding-bottom: 50px; }
.breadcrumb { margin-bottom: 20px; }

/* 筛选面板 */
.filter-panel { background: #fff; border-radius: 8px; padding: 10px 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.filter-row { display: flex; border-bottom: 1px dashed #eee; padding: 15px 0; }
.filter-row .label { width: 90px; color: #999; font-size: 14px; line-height: 28px; }
.filter-row .options { flex: 1; display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }
.option { font-size: 14px; color: #333; cursor: pointer; padding: 4px 12px; border-radius: 4px; transition: all 0.2s; }
.option:hover { color: #ff3b30; }
.option.active { background: #ff3b30; color: #fff; }

/* 商品卡片 */
.pc-account-card { cursor: pointer; border-radius: 8px; border: none; transition: transform 0.2s; }
.pc-account-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
:deep(.el-card__body) { padding: 0; }
.card-img { height: 160px; position: relative; }
.server-tag { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.6); color: #fff; font-size: 12px; padding: 4px 0; text-align: center; }
.card-info { padding: 15px; }
.title { font-weight: bold; font-size: 14px; margin-bottom: 10px; line-height: 20px; height: 40px; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.tags { margin-bottom: 15px; display: flex; gap: 6px; }
.price-box { display: flex; justify-content: space-between; align-items: center; }
.price { color: #ff3b30; font-size: 12px; }
.price b { font-size: 20px; }

/* 客服弹窗样式 */
.help-dialog-content { text-align: center; }
.qrcode-img { width: 160px; height: 160px; border-radius: 8px; border: 1px solid #eee; padding: 5px; }
.wechat-id { font-size: 15px; color: #666; margin: 5px 0; }
.work-time { font-size: 13px; color: #999; margin-bottom: 15px; }
.faq-list { text-align: left; background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 14px; color: #555; }
.faq-list ul { padding-left: 15px; margin: 10px 0; list-style: none; }
.faq-list li { margin-bottom: 8px; }

/* 分页器 */
.pagination-box { display: flex; justify-content: center; margin-top: 30px; }
</style>