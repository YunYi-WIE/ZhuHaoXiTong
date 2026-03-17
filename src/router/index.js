import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('../views/layout/Layout.vue'),
      redirect: '/home',
      children: [
        // 主导航页面
        { path: '/home', name: 'Home', component: () => import('../views/home/Home.vue') },
        { path: '/publish', name: 'Publish', component: () => import('../views/publish/Publish.vue') },
        { path: '/message', name: 'Message', component: () => import('../views/message/Message.vue') },
        { path: '/mine', name: 'Mine', component: () => import('../views/mine/Mine.vue') },
        
        // 其他核心业务页面
        { path: '/lobby', name: 'Lobby', component: () => import('../views/lobby/Lobby.vue') },
        { path: '/order', name: 'Order', component: () => import('../views/order/Order.vue') },
        { path: '/detail/:id', name: 'Detail', component: () => import('../views/detail/Detail.vue') },
        { path: '/pay', name: 'Pay', component: () => import('../views/pay/Pay.vue') }
      ]
    }
  ]
})

export default router