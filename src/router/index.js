import { createRouter, createWebHistory } from 'vue-router';
import { useSiteBrandingStore } from '@/stores/siteBranding';
// 引入刚刚写好的带有底部导航栏的 Layout 组件
import Layout from '@/views/layout/Layout.vue';

const routes = [
  {
    path: '/',
    component: Layout, // 🚀 核心：将带有 Tabbar 的组件设为父路由
    redirect: '/home',
    children: [
      // 🚀 这 5 个页面必须放在 children 里面，底部导航栏才会跟着显示！
      { 
        path: 'home', 
        component: () => import('@/views/home/Home.vue') 
      },
      { 
        path: 'lobby', 
        component: () => import('@/views/lobby/Lobby.vue') // 👈 确保大厅在这里！
      },
      { 
        path: 'publish', 
        component: () => import('@/views/publish/Publish.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: 'message', 
        component: () => import('@/views/message/Message.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: 'mine', 
        component: () => import('@/views/mine/Mine.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  
  // ==========================================
  // 下面这些页面是【不需要】底部导航栏的独立页面
  // 必须和 Layout 平级，写在外面！
  // ==========================================
  { 
    path: '/detail/:id', 
    component: () => import('@/views/detail/Detail.vue') 
  },
  { 
    path: '/login', 
    component: () => import('@/views/login/Login.vue') 
  },
  { 
    path: '/pay', 
    component: () => import('@/views/pay/Pay.vue'),
    meta: { requiresAuth: true }
  },
  { 
  path: '/order', 
  component: () => import('@/views/order/Order.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/order/detail/:id',
  component: () => import('@/views/order/OrderDetail.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/order/dispute/:orderId',
  component: () => import('@/views/order/OrderDispute.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/setting',
  component: () => import('@/views/setting/Setting.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/wallet',
  component: () => import('@/views/wallet/Wallet.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/real-auth',
  component: () => import('@/views/real-auth/RealAuth.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/my-publish',
  component: () => import('@/views/publish/MyPublish.vue'),
  meta: { requiresAuth: true }
  },
  {
    path: '/boost',
    component: () => import('@/views/boost/Boost.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/boost/pay',
    component: () => import('@/views/boost/BoostPay.vue'),
    meta: { requiresAuth: true }
}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (!to.matched.some((r) => r.meta?.requiresAuth)) return true;

  const token = localStorage.getItem('token');
  if (token) return true;

  return {
    path: '/login',
    query: { redirect: to.fullPath }
  };
});

router.afterEach((to) => {
  const s = useSiteBrandingStore();
  const brand = s.siteName || '租号平台';
  const t = to.meta?.title;
  document.title = t ? `${t} · ${brand}` : brand;
});

export default router;