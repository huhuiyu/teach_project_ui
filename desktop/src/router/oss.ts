const routes = [
  {
    path: '/oss',
    component: () => import('../view/oss/Home.vue'),
  },
  {
    path: '/oss/config',
    component: () => import('../view/oss/OssConfig.vue'),
  },
]

export default routes
