// 错误页面配置
let routers: any[] = [
  {
    path: '/test/ajax',
    component: () => import('../view/test/Ajax.vue'),
  },
]

if (import.meta.env.PROD) {
  routers = []
}

export default routers
export { routers as testRouters }
