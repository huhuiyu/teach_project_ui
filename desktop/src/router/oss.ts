const routes = [
  {
    path: '/oss',
    component: () => import('../view/oss/Home.vue'),
  },
  {
    path: '/oss/config',
    component: () => import('../view/oss/OssConfig.vue'),
  },
  {
    path: '/oss/bucket',
    component: () => import('../view/oss/Bucket.vue'),
  },
  {
    path: '/oss/file',
    component: () => import('../view/oss/OssFile.vue'),
  },
]

export default routes
