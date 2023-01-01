import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import testRouter from './test'

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import('../view/Home.vue')
  },
].concat(testRouter)


// 创建router
const router = createRouter({
  // 配置为Hash模式
  history: createWebHistory(),
  // 配置toures
  routes,
  // 路由跳转时返回顶部
  scrollBehavior() {
    return { top: 0 }
  }
})

// 设置前置路由守卫
router.beforeEach((to, from, next) => {
  console.log(to, from)
  next()
})

// 设置后置路由守卫
router.afterEach((to, from, failure) => {
  console.log(to, from, failure)

})

export { router }