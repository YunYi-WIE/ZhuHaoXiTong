<template>
  <div class="pc-user-page">
    <div class="pc-header">
      <div class="header-inner">
        <div class="logo-box" @click="router.push('/pc-home')">
          <img src="@/assets/logo.png" class="pc-logo" />
          <span class="pc-brand">哈小龙小店</span>
        </div>
        <div class="header-right">
          <el-button @click="router.push('/pc-home')">返回首页</el-button>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </div>

    <div class="pc-main">
      <el-container class="user-container">
        <el-aside width="200px" class="aside-menu">
          <div class="user-profile">
            <el-avatar :size="60" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
            <div class="nickname">哈小龙用户</div>
            <div class="uid">UID: 888888</div>
          </div>
          <el-menu :default-active="activeMenu" @select="handleSelect" class="menu-list">
            <el-menu-item index="mine"><el-icon><User /></el-icon>个人资产</el-menu-item>
            <el-menu-item index="order"><el-icon><List /></el-icon>我的订单</el-menu-item>
            <el-menu-item index="favorites"><el-icon><Star /></el-icon>我的收藏</el-menu-item>
            <el-menu-item index="settings"><el-icon><Setting /></el-icon>账号设置</el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="main-content">
          <div v-if="activeMenu === 'mine'">
            <h3 class="panel-title">个人资产</h3>
            <el-row :gutter="20" class="asset-row">
              <el-col :span="8">
                <div class="asset-card">
                  <div class="value">￥0.00</div>
                  <div class="label">账户余额</div>
                  <el-button type="primary" size="small" class="action-btn">去充值</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="asset-card">
                  <div class="value">0.00</div>
                  <div class="label">冻结资金</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="asset-card">
                  <div class="value">0</div>
                  <div class="label">积分</div>
                </div>
              </el-col>
            </el-row>
          </div>

          <div v-if="activeMenu === 'order'">
            <h3 class="panel-title">我的订单</h3>
            <el-tabs v-model="orderTab">
              <el-tab-pane label="全部订单" name="all"></el-tab-pane>
              <el-tab-pane label="租赁中" name="renting"></el-tab-pane>
              <el-tab-pane label="待付款" name="pending"></el-tab-pane>
              <el-tab-pane label="已完成" name="finished"></el-tab-pane>
            </el-tabs>
            
            <el-table :data="orderList" style="width: 100%; margin-top: 10px;" border>
              <el-table-column prop="orderNo" label="订单号" width="180" />
              <el-table-column prop="title" label="商品名称" min-width="250" show-overflow-tooltip />
              <el-table-column prop="price" label="实付款" width="100">
                <template #default="scope"><span style="color: #ff3b30; font-weight: bold;">￥{{ scope.row.price }}</span></template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '租赁中' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default>
                  <el-button size="small" type="primary" link>查看密码</el-button>
                  <el-button size="small" type="danger" link>维权</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="activeMenu === 'favorites'">
            <h3 class="panel-title">我的收藏</h3>
            <el-empty v-if="favorites.length === 0" description="暂无收藏" />
            <el-row :gutter="20" v-else>
              <el-col :span="8" v-for="item in favorites" :key="item.id" style="margin-bottom: 20px;">
                <el-card shadow="hover" class="pc-account-card" @click="router.push('/pc-detail')">
                  <div class="card-img">
                    <img :src="item.cover" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <div class="card-info">
                    <div class="title">{{ item.title }}</div>
                    <div class="price">￥<b>{{ item.price }}</b>/小时</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <div v-if="activeMenu === 'settings'">
            <h3 class="panel-title">账号设置</h3>
            <el-form label-width="100px" style="max-width: 400px; margin-top: 20px;">
              <el-form-item label="手机号码">
                <el-input value="138****8888" disabled />
              </el-form-item>
              <el-form-item label="实名认证">
                <el-tag type="warning">未认证</el-tag>
                <el-button type="primary" link style="margin-left: 10px;">去认证</el-button>
              </el-form-item>
              <el-form-item label="登录密码">
                <el-button>修改密码</el-button>
              </el-form-item>
            </el-form>
          </div>

        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const activeMenu = ref('mine');
const orderTab = ref('all');

// 菜单切换逻辑
const handleSelect = (index) => {
  activeMenu.value = index;
};

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('已退出登录');
    router.push('/pc-login');
  }).catch(() => {});
};

// 模拟数据
const orderList = ref([
  { orderNo: 'RN202310248899', title: '【包赔】V10全英雄全皮肤/武则天', price: '17.40', status: '租赁中' },
  { orderNo: 'RN202310247766', title: '和平精英 玛莎拉蒂/火箭少女101', price: '12.00', status: '已完成' }
]);

const favorites = ref([
  { id: 1, title: '和平精英 玛莎拉蒂/火箭少女101/多粉装退游甩租', price: '4.0', cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg' }
]);
</script>

<style scoped>
.pc-user-page { background-color: #f5f7fa; min-height: 100vh; }

/* 头部简易复用 */
.pc-header { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
.logo-box { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.pc-logo { height: 40px; border-radius: 4px; }
.pc-brand { font-size: 20px; font-weight: bold; color: #333; }

/* 主体布局 */
.pc-main { max-width: 1200px; margin: 20px auto; padding-bottom: 50px; }
.user-container { background: transparent; }

/* 左侧菜单 */
.aside-menu { background: #fff; border-radius: 8px; margin-right: 20px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.user-profile { padding: 30px 20px; text-align: center; border-bottom: 1px solid #f0f0f0; background: linear-gradient(135deg, #fdfaf6, #fff); }
.nickname { font-size: 16px; font-weight: bold; margin-top: 10px; color: #333; }
.uid { font-size: 12px; color: #999; margin-top: 4px; }
.menu-list { border-right: none; }

/* 右侧内容 */
.main-content { background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); min-height: 600px; }
.panel-title { font-size: 20px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 1px solid #ebeef5; color: #333; }

/* 资产卡片 */
.asset-card { background: #f8f9fa; border-radius: 8px; padding: 30px 20px; text-align: center; position: relative; }
.asset-card .value { font-size: 28px; font-weight: bold; color: #ff3b30; font-family: DINAlternate-Bold, sans-serif; margin-bottom: 10px; }
.asset-card .label { font-size: 14px; color: #666; }
.action-btn { position: absolute; top: 15px; right: 15px; }

/* 收藏卡片复用 */
.pc-account-card { cursor: pointer; border-radius: 8px; border: none; }
:deep(.el-card__body) { padding: 0; }
.card-img { height: 120px; }
.card-info { padding: 12px; }
.title { font-weight: bold; font-size: 13px; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.price { color: #ff3b30; font-size: 12px; }
.price b { font-size: 18px; }
</style>