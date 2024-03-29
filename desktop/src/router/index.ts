import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import logger from '../tools/logger'
import testRouter from './test'
import userRouter from './user'
import messageRouter from './message'
import manageRouter from './manage'
import dialog from '../tools/dialog'
import ossRouter from './oss'
import adminRouter from './admin'
import portableRouter from './portable'
import toll from './toll'
import contacts from './contacts'
import notepad from './notepad'
import charts from './charts'
import tree from './tree'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../view/Home.vue'),
  },
  {
    path: '/manage',
    component: () => import('../view/ManageHome.vue'),
  },

  {
    path: '/chatroom',
    component: () => import('../view/ChatRoom.vue'),
  },
  {
    path: '/login',
    component: () => import('../view/Login.vue'),
  },
]
  .concat(testRouter)
  .concat(userRouter)
  .concat(messageRouter)
  .concat(manageRouter)
  .concat(ossRouter)
  .concat(adminRouter)
  .concat(portableRouter)
  .concat(notepad)
  .concat(toll)
  .concat(contacts)
  .concat(charts)
  .concat(tree)

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
  dialog.startLoading()
  logger.debug('路由前置：', to, from)
  next()
})

// 设置后置路由守卫
router.afterEach((to, from, failure) => {
  dialog.finishLoading()
  logger.debug('路由后置：', to, from, failure)
})

export { router }
