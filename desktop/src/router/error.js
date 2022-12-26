// 错误信息模块路由配置
let routers = []

routers = routers.concat([
  {
    path: '/error/code404',
    name: 'code404',
    component: () => import('../views/error/Code404.vue'),
  },
])
export default routers
