const routes = [
  {
    path: '/test/class',
    component: () => import('../view/classManage/testClass.vue'),
  },
  {
    path: '/test/student',
    component: () => import('../view/classManage/testStudent.vue'),
  },
]
let exportRouter = routes
// 生产环境中不输出测试相关路由
if (import.meta.env.PROD) {
  // exportRouter = []
}

export default routes
