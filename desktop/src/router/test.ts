const routes = [
  {
    path: "/test",
    component: () => import('../view/test/Home.vue')
  },{
    path: "/test/userinfo",
    component: () => import('../view/test/TestUserInfo.vue')
  },
]

let exportRouter = routes
// 生产环境中不输出测试相关路由
if (import.meta.env.PROD) {
  exportRouter = []
}

export default exportRouter