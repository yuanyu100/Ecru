import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/pages/index/index'
  },
  {
    path: '/pages/index/index',
    name: 'Index',
    component: () => import('../pages/index/index.vue'),
    meta: { title: '首页', transition: 'fade' }
  },
  {
    path: '/pages/wardrobe/wardrobe',
    name: 'Wardrobe',
    component: () => import('../pages/wardrobe/wardrobe.vue'),
    meta: { title: '衣橱', transition: 'slide' }
  },
  {
    path: '/pages/recommendation/recommendation',
    name: 'Recommendation',
    component: () => import('../pages/recommendation/recommendation.vue'),
    meta: { title: '推荐', transition: 'slide' }
  },
  {
    path: '/pages/analysis/analysis',
    name: 'Analysis',
    component: () => import('../pages/analysis/analysis.vue'),
    meta: { title: '分析', transition: 'slide' }
  },
  {
    path: '/pages/profile/profile',
    name: 'Profile',
    component: () => import('../pages/profile/profile.vue'),
    meta: { title: '我的', transition: 'slide' }
  },
  {
    path: '/pages/login/login',
    name: 'Login',
    component: () => import('../pages/login/login.vue'),
    meta: { title: '登录', transition: 'fade' }
  },
  {
    path: '/pages/register/register',
    name: 'Register',
    component: () => import('../pages/register/register.vue'),
    meta: { title: '注册', transition: 'fade' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '穿搭推荐系统'
  next()
})

export default router