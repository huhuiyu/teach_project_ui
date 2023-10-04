// 错误页面配置
const routers: any[] = [
  {
    path: '/error404',
    component: () => import('../view/error/Error404.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error404',
  },
]

export default routers
export { routers as errorRouters }
