// 第三方api模块路由配置
let routers = []

routers = routers.concat([
  {
    path: '/api/amap',
    name: 'Main',
    component: () => import('../views/api/AMap.vue'),
  },
])
export default routers
