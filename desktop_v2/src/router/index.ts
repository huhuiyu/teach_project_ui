import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'

import { Logger as logger } from '../script/Logger'
import { errorRouters } from './error'
import { testRouters } from './test'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../view/Home.vue'),
  },
]
  .concat(errorRouters)
  .concat(testRouters)

// 创建router
const router = createRouter({
  // 配置为Hash模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 配置toures
  routes,
  // 路由跳转时返回顶部
  scrollBehavior() {
    return { top: 0 }
  },
})

// 设置前置路由守卫
router.beforeEach((to, from, next) => {
  logger.debug('路由前置：', to, from)
  next()
})

// 设置后置路由守卫
router.afterEach((to, from, failure) => {
  logger.debug('路由后置：', to, from, failure)
})

export { router }
