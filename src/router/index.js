import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home' // 默认重定向到首页
    },
    
    // ================= 全端响应式路由区 =================
    { 
      path: '/detail/:id?', // 加入参数占位，方便传参
      name: 'Detail', 
      component: () => import('../views/detail/Detail.vue') 
    },
    { 
      path: '/login', 
      name: 'Login', 
      component: () => import('../views/login/Login.vue') 
    },
    { 
      path: '/favorites', 
      name: 'Favorites', 
      component: () => import('../views/mine/Favorites.vue') 
    },
    { 
      path: '/setting', 
      name: 'Setting', 
      component: () => import('../views/setting/Setting.vue') 
    },
    {
      path: '/after-sales',
      name: 'AfterSales',
      component: () => import('../views/order/AfterSales.vue')
    },
    {
      path: '/pay',
      name: 'Pay',
      component: () => import('../views/pay/Pay.vue')
    },  
    
    // ================= 带有底部导航栏/顶栏的布局页 =================
    {
      path: '/layout',
      name: 'Layout',
      component: () => import('../views/layout/Layout.vue'),
      children: [
        { path: '/home', name: 'Home', component: () => import('../views/home/Home.vue') },
        { path: '/lobby', name: 'Lobby', component: () => import('../views/lobby/Lobby.vue') },
        { path: '/order', name: 'Order', component: () => import('../views/order/Order.vue') },
        { path: '/mine', name: 'Mine', component: () => import('../views/mine/Mine.vue') }
      ]
    }
  ]
})

// 不再需要任何路由拦截，响应式完全交给 CSS 媒体查询处理
export default router