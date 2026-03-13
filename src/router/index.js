import { createRouter, createWebHistory } from 'vue-router'

// 设备检测函数
const isMobile = () => {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home' // 默认值，实际会被下方的守卫拦截
    },
    
    // ================= PC 端路由区 =================
    {
      path: '/pc-home',
      name: 'PCHome',
      component: () => import('../views/pc/PCHome.vue')
    },
    {
      path: '/pc-lobby',
      name: 'PCLobby',
      component: () => import('../views/pc/PCLobby.vue')
    },
    //新增详情页路由
    {
      path: '/pc-detail',
      name: 'PCDetail',
      component: () => import('../views/pc/PCDetail.vue')
    },
    //新增登录页路由
    {
      path: '/pc-login',
      name: 'PCLogin',
      component: () => import('../views/pc/PCLogin.vue')
    },
    // PC用户中心综合路由
    {
      path: '/pc-user',
      name: 'PCUserCenter',
      component: () => import('../views/pc/PCUserCenter.vue')
    },

    // ================= H5 端路由区 =================
    { path: '/detail', name: 'Detail', component: () => import('../views/detail/Detail.vue') },
    { path: '/login', name: 'Login', component: () => import('../views/login/Login.vue') },
    { path: '/favorites', name: 'Favorites', component: () => import('../views/mine/Favorites.vue') },
    { path: '/settings', name: 'Settings', component: () => import('../views/mine/Settings.vue') },
    {
      path: '/h5-layout',
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

// 🛡️ 重点：全局路由守卫（类似安检机，每次页面跳转/刷新都要经过这里）
router.beforeEach((to, from, next) => {
  const isMob = isMobile();

  // 1. 如果是【手机端】，但试图访问【PC端页面】(路径包含 /pc-)
  if (isMob && to.path.includes('/pc-')) {
    next('/home'); // 强制踢回手机版首页
  }
  // 2. 如果是【电脑端】，但试图访问【手机端页面】(路径不包含 /pc-)
  else if (!isMob && !to.path.includes('/pc-')) {
    next('/pc-home'); // 强制踢回电脑版首页
  }
  // 3. 设备和页面匹配，正常放行
  else {
    next(); 
  }
})

export default router