// 管理员模块路由配置
let routers = []

routers = routers.concat([
  {
    path: '/admin/main',
    name: 'Main',
    component: () => import('../views/admin/Main.vue'),
  },
])
export default routers
