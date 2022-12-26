// 测试用模块路由配置
let routers = []
// 测试路由不发布到生产环境
if (process.env.NODE_ENV === 'development') {
  routers = routers.concat([
    {
      path: '/test',
      name: 'index',
      component: () => import('../views/test/Home.vue'),
    },
    {
      path: '/test/chat',
      name: 'chat',
      component: () => import('../views/test/ChatView.vue'),
    },
    {
      path: '/test/route',
      name: 'route',
      component: () => import('../views/test/RouteView.vue'),
    },
    {
      path: '/test/route/:info',
      name: 'routeinfo',
      component: () => import('../views/test/RouteInfoView.vue'),
    },
  ])
}
export default routers
