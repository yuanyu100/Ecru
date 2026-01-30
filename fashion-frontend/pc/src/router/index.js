import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '仪表盘' }
  },
  {
    path: '/wardrobe',
    name: 'Wardrobe',
    component: () => import('../views/Wardrobe.vue'),
    meta: { title: '衣橱管理' }
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('../views/Analysis.vue'),
    meta: { title: '分析报告' }
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('../views/Knowledge.vue'),
    meta: { title: '知识库' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { title: '系统设置' }
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '穿搭推荐系统'
  next()
})

export default router