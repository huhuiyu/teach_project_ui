const routes = [
  {
    path: '/test',
    component: () => import('../view/test/Home.vue'),
  },
  {
    path: '/test/userinfo',
    component: () => import('../view/test/TestUserInfo.vue'),
  },
  {
    path: '/test/naiveui',
    component: () => import('../view/test/NaiveUI.vue'),
  },
  {
    path: '/test/comp/:comp',
    component: () => import('../view/test/TestComp.vue'),
  },
  {
    path: '/test/edit',
    component: () => import('../view/test/TestWangEditor.vue'),
  },
  {
    path: '/test/router',
    component: () => import('../view/test/TestRouter.vue'),
  },
  {
    path: '/test/portable',
    component: () => import('../view/test/TestPortable.vue'),
  },
  {
    path: '/test/amap',
    component: () => import('../view/test/AMap.vue'),
  },
  {
    path: '/test/tree',
    component: () => import('../view/test/Tree.vue'),
  },
  {
    path: '/test/arrtotree',
    component: () => import('../view/test/ArrayToTree.vue'),
  },
]

let exportRouter = routes
// 生产环境中不输出测试相关路由
if (import.meta.env.PROD) {
  // exportRouter = []
}

export default exportRouter
