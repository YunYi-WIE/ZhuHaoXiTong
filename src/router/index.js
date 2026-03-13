import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    // ---- 重点：不需要底部导航的页面写在外面 ----
    {
      path: '/detail',
      name: 'Detail',
      component: () => import('../views/detail/Detail.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/Login.vue')
    },
    // ---- 需要底部导航的页面写在 Layout 的 children 里 ----
    {
      path: '/',
      name: 'Layout',
      component: () => import('../views/layout/Layout.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/home/Home.vue')
        },
        {
          path: 'lobby',
          name: 'Lobby',
          component: () => import('../views/lobby/Lobby.vue')
        },
        {
          path: 'order',
          name: 'Order',
          component: () => import('../views/order/Order.vue')
        },
        {
          path: 'mine',
          name: 'Mine',
          component: () => import('../views/mine/Mine.vue')
        }
      ]
    }
  ]
})

export default router