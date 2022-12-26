// 应用管理员模块路由配置
let routers = []

routers = routers.concat([
  {
    path: '/appadmin/main',
    name: 'Main',
    component: () => import('../views/appadmin/Main.vue'),
  },
])
export default routers
