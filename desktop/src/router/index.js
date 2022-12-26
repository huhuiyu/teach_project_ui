import Vue from 'vue'
import VueRouter from 'vue-router'

// 分模块路由
import user from '@/router/user'
import admin from '@/router/admin'
import appadmin from '@/router/appadmin'
import api from '@/router/api'

import test from '@/router/test'
import error from '@/router/error'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/findpwd',
    name: 'FindPwd',
    component: () => import('../views/FindPwd.vue'),
  },
]
  .concat(user)
  .concat(admin)
  .concat(appadmin)
  .concat(api)
  .concat(test)
  .concat(error)
  .concat([
    {
      path: '*',
      redirect: '/error/code404',
    },
  ])

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
